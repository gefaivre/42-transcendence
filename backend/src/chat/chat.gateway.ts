import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { PostDto, PostEmitDto } from './dto/post.dto';
import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChannelDto } from 'src/channel/dto/channel.dto';
import { ChatGuard } from './chat.guard';
import { WsActionSuccess, WsActionFailure, WsFailureReason, WsHandlerSuccessServerLog, WsHandlerSuccessClientLog, WsLifecycleHookSuccessServerLog, WsLifecycleHookSuccessClientLog, WsLifecycleHookFailureServerLog, WsLifecycleHookFailureClientLog, WsHandlerFailureServerLog, WsHandlerFailureClientLog } from './types/types';
import { BadRequestTransformationFilter } from './chat.filter';
import { ChannelService } from 'src/channel/channel.service';
import { ChatUser } from './class/ChatUser';
import { PostsService } from 'src/posts/posts.service';
import { SendDirectMessageDto } from './dto/send-direct-message.dto';
import { DirectMessageService } from './dm.service';
import { UsersService } from 'src/users/users.service';
import { CreateDirectMessage } from './class/CreateDirectMessage';

// TODO: extract `user` someway with Guard, Pipe, Interceptor, Middleware, etc. before handlers execution
//       (main difficulty here is that TransformationPipe can't be applied upon @ConnectedSocket instance)

// For the moment, when an event handler succeed, backend returns a string.
// (Yes, this string is typed with something like `WsHandlerSuccessClientLog` but its just a string.)
// In the frontend, this string is retrieved as parameter of the acknowledgement callback function of the corresponding `emit()`.
// In the future, if we decide to return a proper `WsResponse` instead of this simple string,
// note that we will no longer be able to retrieve this return value the same way.
// We will need to define a proper `socket.on()` event listener:
//  - the WsResponse's `event` field will be its first parameter (the event to listen to).
//  - the WsResponse's  `data` field will be the parameter of the callback function (its second parameter).

@WebSocketGateway({
  path: '/chat',
  cors: {
    origin: 'http://localhost:8080',
    credentials: true
  },
})
@UseFilters(BadRequestTransformationFilter)
@UsePipes(ValidationPipe)
@UseGuards(ChatGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger: Logger = new Logger(ChatGateway.name, { timestamp: true })

  constructor(
    private chatService: ChatService,
    private postsService: PostsService,
    private channelService: ChannelService,
    private usersService: UsersService,
    private dmService: DirectMessageService
  ) {}

  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.socketId === client.id) as ChatUser

    client.join(room)

    const channelPosts: PostEmitDto[] = await this.chatService.retrieveChannelPosts(room)
    for (const post of channelPosts)
      client.emit('post', post)

    return this.eventHandlerSuccess(user, room, WsActionSuccess.JoinRoom)
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: ChannelDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.socketId === client.id) as ChatUser

    try {
      await this.channelService.addUserToChannel(channel.channelName, user.prismaId)
    } catch(e) {
      return this.eventHandlerFailure(user, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.InternalError)
    }

    this.server.to(channel.channelName).emit('channelEvent', { user: user.username, event: 'join' })

    return this.eventHandlerSuccess(user, channel.channelName, WsActionSuccess.JoinChannel)
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: string) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.socketId === client.id) as ChatUser

    try {
      await this.channelService.leave(channel, user.prismaId)
    } catch(e) {
      return this.eventHandlerFailure(user, channel, WsActionFailure.LeaveChannel, WsFailureReason.InternalError)
    }

    client.leave(channel)

    this.server.to(channel).emit('channelEvent', { user: user.username, event: 'leave' })

    return this.eventHandlerSuccess(user, channel, WsActionSuccess.LeaveChannel)
  }

  @SubscribeMessage('sendPost')
  async handlePost(@ConnectedSocket() client: Socket, @MessageBody() post: PostDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.socketId === client.id) as ChatUser

    // Since `ChatGuard` has been applied we assume the channel exists
    const channelId: number = (await this.channelService.findByName(post.channelName))?.id as number

    // TODO (?): try/catch
    await this.postsService.create({ content: post.content, channelId: channelId, authorId: user.prismaId })

    this.server.to(post.channelName).emit('post', {
      channelName: post.channelName,
      content: post.content,
      author: user.username
    } as PostEmitDto)

    return this.eventHandlerSuccess(user, post.channelName, WsActionSuccess.Post)
  }

  @SubscribeMessage('sendDirectMessage')
  async handleSendDirectMessage(@ConnectedSocket() client: Socket, @MessageBody() message: SendDirectMessageDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const sender: ChatUser = this.chatService.users.find(user => user.socketId === client.id) as ChatUser

    // TODO: add `UserByNamePipe` into to `DirectMessageDto` (would lead to delete `this.userService`)
    const recipient: any = await this.usersService.findByUsername(message.recipient)

    // db
    await this.dmService.create({
      content: message.content,
      senderId: sender.prismaId,
      receiverId: recipient.id
    } as CreateDirectMessage)

    // emit to recipient if connected
    const _recipient: ChatUser | undefined = this.chatService.users.find(user => user.username === message.recipient)
    if (_recipient !== undefined)
      this.server.to(_recipient.socketId).emit('dm', message.content)

    // emit to sender so he doesn't need to refresh the page to see the message
    this.server.to(client.id).emit('dm', message.content)

    return this.eventHandlerSuccess(sender, message.recipient, WsActionSuccess.DirectMessage)
  }


  afterInit() {
    this.logger.log(WsActionSuccess.Init)
  }

  // guard can't be applied here
  // see https://github.com/nestjs/nest/issues/882
  async handleConnection(@ConnectedSocket() client: Socket) {

    const authHeader: string | undefined = client.request.headers.cookie

    if (!authHeader)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Connect, WsFailureReason.AuthCookieNotFound)

    const tokenData: any = await this.chatService.validateUser(authHeader)
    const user: ChatUser | undefined = await this.chatService.addUser(client.id, tokenData)

    if (user == undefined)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Connect, WsFailureReason.UserNotFound)

    return this.lifecycleHookSuccess(user, WsActionSuccess.Connect)
  }

  // guard can't be applied here
  // see https://github.com/nestjs/nest/issues/882
  async handleDisconnect(@ConnectedSocket() client: Socket) {

    const user: ChatUser | undefined = this.chatService.getUserBySocketId(client.id)

    if (user === undefined)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Disconnect, WsFailureReason.UserNotFound)

    this.chatService.removeUser(user.username)

    return this.lifecycleHookSuccess(user, WsActionSuccess.Disconnect)
  }

  eventHandlerSuccess(sender: ChatUser, recipient: string, action: WsActionSuccess) {
    this.logger.log(`client ${sender.socketId} (user ${sender.username}) ${action} ${recipient}` as WsHandlerSuccessServerLog)
    return `${action} ${recipient}` as WsHandlerSuccessClientLog
  }

  eventHandlerFailure(sender: ChatUser, recipient: string, action: WsActionFailure, reason: WsFailureReason) {
    this.logger.warn(`client ${sender.socketId} (user ${sender.username}) ${action} ${recipient}: ${reason}` as WsHandlerFailureServerLog)
    throw new WsException(`${action} ${recipient}: ${reason}` as WsHandlerFailureClientLog)
  }

  lifecycleHookFailure(id: string, action: WsActionFailure, reason: WsFailureReason) {
    this.logger.warn(`client ${id} ${action}: ${reason}` as WsLifecycleHookFailureServerLog)
    throw new WsException(`${action}: ${reason}` as WsLifecycleHookFailureClientLog)
  }

  lifecycleHookSuccess(user: ChatUser, action: WsActionSuccess) {
    this.logger.log(`client ${user.socketId} (user ${user.username}) ${action}` as WsLifecycleHookSuccessServerLog)
    return action as WsLifecycleHookSuccessClientLog
  }

}
