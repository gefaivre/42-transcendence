import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { PostDto } from './dto/post-dto';
import { PostEmitDto } from './dto/post-emit.dto';
import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChannelDto } from './dto/channel-dto';
import { ChatGuard } from './chat.guard';
import { WsActionSuccess, WsActionFailure, WsFailureReason, WsHandlerSuccessServerLog, WsHandlerSuccessClientLog, WsLifecycleHookSuccessServerLog, WsLifecycleHookSuccessClientLog, WsLifecycleHookFailureServerLog, WsLifecycleHookFailureClientLog } from './types/types';
import { BadRequestTransformationFilter } from './chat.filter';
import { ChannelService } from 'src/channel/channel.service';
import { ChatUser } from './class/ChatUser';
import { PostsService } from 'src/posts/posts.service';

// TODO: extract `username` someway with Guard, Pipe, Interceptor, Middleware, etc. before handlers execution
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
  ) {}

  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.clientId === client.id) as ChatUser

    client.join(room)

    const channelPosts: PostEmitDto[] = await this.chatService.retrieveChannelPosts(room)
    for (const post of channelPosts)
      client.emit('post', post)

    return this.eventHandlerSuccess(client.id, user.username, room, WsActionSuccess.JoinRoom)
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: ChannelDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.clientId === client.id) as ChatUser

    // Since `ChatGuard` has been applied we assume the channel exists
    const channelId: number = (await this.channelService.findByName(channel.channelName))?.id as number

    // TODO (?): try/catch
    await this.channelService.addUserToChannel(channelId, user.id);

    this.server.to(channel.channelName).emit('channelEvent', { user: user.username, event: 'join' })

    return this.eventHandlerSuccess(client.id, user.username, channel.channelName, WsActionSuccess.JoinChannel)
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: string) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.clientId === client.id) as ChatUser

    // Since `ChatGuard` has been applied we assume the channel exists
    const channelId: number = (await this.channelService.findByName(channel))?.id as number

    // TODO (?): try/catch
    await this.channelService.removeUserFromChannel(channelId, user.id)

    client.leave(channel)

    this.server.to(channel).emit('channelEvent', { user: user.username, event: 'leave' })

    return this.eventHandlerSuccess(client.id, user.username, channel, WsActionSuccess.LeaveChannel)
  }

  @SubscribeMessage('sendPost')
  async handlePost(@ConnectedSocket() client: Socket, @MessageBody() post: PostDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: ChatUser = this.chatService.users.find(user => user.clientId === client.id) as ChatUser

    // Since `ChatGuard` has been applied we assume the channel exists
    const channelId: number = (await this.channelService.findByName(post.channelName))?.id as number

    // TODO (?): try/catch
    await this.postsService.create({ content: post.content, channelId: channelId, authorId: user.id })

    this.server.to(post.channelName).emit('post', {
      channelName: post.channelName,
      content: post.content,
      author: user.username
    } as PostEmitDto)

    return this.eventHandlerSuccess(client.id, user.username, post.channelName, WsActionSuccess.Post)
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

    const tokenData: any = await this.chatService.validateUser(authHeader as string)
    const username: string | undefined = await this.chatService.addUser(client.id, tokenData)

    if (!username)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Connect, WsFailureReason.UserNotFound)

    return this.lifecycleHookSuccess(client.id, username, WsActionSuccess.Connect)
  }

  // guard can't be applied here
  // see https://github.com/nestjs/nest/issues/882
  async handleDisconnect(@ConnectedSocket() client: Socket) {

    const user: ChatUser | undefined = this.chatService.getUserBySocketId(client.id)

    if (user === undefined)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Disconnect, WsFailureReason.UserNotFound)

    this.chatService.removeUser(user.username as string)

    return this.lifecycleHookSuccess(client.id, user.username, WsActionSuccess.Disconnect)
  }

  eventHandlerSuccess(id: string,  username: string, channel: string, action: WsActionSuccess) {
    this.logger.log(`client ${id} (user ${username}) ${action} ${channel}` as WsHandlerSuccessServerLog)
    return `${action} ${channel}` as WsHandlerSuccessClientLog
  }

  lifecycleHookFailure(id: string, action: WsActionFailure, reason: WsFailureReason) {
    this.logger.warn(`client ${id} ${action}: ${reason}` as WsLifecycleHookFailureServerLog)
    throw new WsException(`${action}: ${reason}` as WsLifecycleHookFailureClientLog)
  }

  lifecycleHookSuccess(id: string, username: string, action: WsActionSuccess) {
    this.logger.log(`client ${id} (user ${username}) ${action}` as WsLifecycleHookSuccessServerLog)
    return action as WsLifecycleHookSuccessClientLog
  }

}
