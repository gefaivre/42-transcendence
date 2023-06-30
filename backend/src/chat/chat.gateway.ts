import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { PostDto, PostEmitDto } from './dto/post.dto';
import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChannelDto } from 'src/channel/dto/channel.dto';
import { ChatGuard } from './chat.guard';
import { WsActionSuccess, WsActionFailure, WsFailureCause, WsHandlerSuccessServerLog, WsHandlerSuccessClientLog, WsLifecycleHookSuccessServerLog, WsLifecycleHookSuccessClientLog, WsLifecycleHookFailureServerLog, WsLifecycleHookFailureClientLog, WsHandlerFailureServerLog, WsHandlerFailureClientLog } from './types/types';
import { BadRequestTransformationFilter } from 'src/filters';
import { ChannelService } from 'src/channel/channel.service';
import { WsUser } from 'src/types';
import { PostsService } from 'src/posts/posts.service';
import { SendDirectMessageDto } from './dto/send-direct-message.dto';
import { DirectMessageService } from './dm.service';
import { UsersService } from 'src/users/users.service';
import { CreateDirectMessage } from './types/CreateDirectMessage';
import { MuteDto } from './dto/mute.dto';
import { User } from '@prisma/client';

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
    origin: `${process.env.COMMON_BASE_URL}:8080`,
    credentials: true
  },
})
@UseFilters(BadRequestTransformationFilter)
@UsePipes(ValidationPipe)
@UseGuards(ChatGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger: Logger = new Logger(ChatGateway.name, { timestamp: true })

  constructor(
    private readonly chat: ChatService,
    private readonly posts: PostsService,
    private readonly channel: ChannelService,
    private readonly users: UsersService,
    private readonly dm: DirectMessageService
  ) {}

  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: WsUser = this.chat.chatUsers.find(user => user.socketId === client.id) as WsUser

    client.join(room)

    const channelPosts: PostEmitDto[] = await this.chat.retrieveChannelPosts(room)
    for (const post of channelPosts)
      client.emit('post', post)

    return this.eventHandlerSuccess(user, room, WsActionSuccess.JoinRoom)
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: WsUser = this.chat.chatUsers.find(user => user.socketId === client.id) as WsUser

    client.leave(room)

    return this.eventHandlerSuccess(user, room, WsActionSuccess.LeaveRoom)
  }

  // This is not used anymore: frontend join channel via HTTP at '/channel/join/'
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: ChannelDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: WsUser = this.chat.chatUsers.find(user => user.socketId === client.id) as WsUser

    // Check if user is banned
    if (await this.channel.isBanned(channel.channelName, user.prismaId) === true)
      return this.eventHandlerFailure(user, channel.channelName, WsActionFailure.JoinChannel, WsFailureCause.UserBanned)

    try {
      await this.channel.addUserToChannel(channel.channelName, user.prismaId)
    } catch(e) {
      return this.eventHandlerFailure(user, channel.channelName, WsActionFailure.JoinChannel, WsFailureCause.InternalError)
    }

    this.server.to(channel.channelName).emit('channelEvent', { user: user.username, event: 'join' })

    return this.eventHandlerSuccess(user, channel.channelName, WsActionSuccess.JoinChannel)
  }

  // This is not used anymore: fontend leave channel via HTTP at '/channel/leave/:channelName'
  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: string) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: WsUser = this.chat.chatUsers.find(user => user.socketId === client.id) as WsUser

    try {
      await this.channel.leave(channel, user.prismaId)
    } catch(e) {
      return this.eventHandlerFailure(user, channel, WsActionFailure.LeaveChannel, WsFailureCause.InternalError)
    }

    client.leave(channel)

    this.server.to(channel).emit('channelEvent', { user: user.username, event: 'leave' })

    return this.eventHandlerSuccess(user, channel, WsActionSuccess.LeaveChannel)
  }

  @SubscribeMessage('sendPost')
  async handlePost(@ConnectedSocket() client: Socket, @MessageBody() post: PostDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: WsUser = this.chat.chatUsers.find(user => user.socketId === client.id) as WsUser

    // Since `ChatGuard` has been applied we assume the channel exists
    const channelId: number = (await this.channel.findByName(post.channelName))?.id as number

    // Check if user is muted
    if (this.chat.isMutedByPrismaId(user.prismaId) === true)
      return this.eventHandlerFailure(user, post.channelName, WsActionFailure.Post, WsFailureCause.UserMuted)

    // TODO (?): try/catch
    const _post = await this.posts.create({ content: post.content, channelId: channelId, authorId: user.prismaId })

    this.server.to(post.channelName).emit('post', {
      channelName: post.channelName,
      content: post.content,
      author: user.username,
      date: _post.date
    } as PostEmitDto)

    return this.eventHandlerSuccess(user, post.channelName, WsActionSuccess.Post)
  }

  @SubscribeMessage('sendDirectMessage')
  async handleSendDirectMessage(@ConnectedSocket() client: Socket, @MessageBody() message: SendDirectMessageDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const sender: WsUser = this.chat.chatUsers.find(user => user.socketId === client.id) as WsUser

    // TODO: add `UserByNamePipe` into `DirectMessageDto` (would lead to delete `this.userService`)
    const recipient: any = await this.users.findByUsername(message.recipient)

    // db
    const dm = await this.dm.create({
      content: message.content,
      senderId: sender.prismaId,
      receiverId: recipient.id
    } as CreateDirectMessage)

    // emit to recipient if connected
    // since we can't distinguish the dm socket from the online status socket of the recipient we emit to both (yes, this is ugly)
    const _recipient: WsUser[] | undefined = this.chat.chatUsers.filter(user => user.username === message.recipient)
    if (_recipient !== undefined)
      _recipient.forEach(r => this.server.to(r.socketId).emit('dm', message.content, sender.username, dm.date))

    // emit to sender so he doesn't need to refresh the page to see the message
    this.server.to(client.id).emit('dm', message.content, sender.username, dm.date)

    return this.eventHandlerSuccess(sender, message.recipient, WsActionSuccess.DirectMessage)
  }

  // TODO: log must precise from which channel user has been muted
  @SubscribeMessage('mute')
  async handleMute(@ConnectedSocket() client: Socket, @MessageBody() body: MuteDto) {

    // Since `ChatGuard` has been applied we assume `user` is not undefined
    const user: WsUser = this.chat.chatUsers.find(user => user.socketId === client.id) as WsUser

    const mutedUser: Omit<User, 'password'> | null = await this.users.findById(body.userId)

    if (mutedUser === null)
      return this.eventHandlerFailure(user, '', WsActionFailure.Mute, WsFailureCause.UserNotFound)

    // Only admins can mute
    if (await this.channel.isAdmin(body.channelName, user.prismaId) === false)
      return this.eventHandlerFailure(user, mutedUser.username, WsActionFailure.Mute, WsFailureCause.UserNotAdmin)

    // Check if user already muted
    if (this.chat.isMutedByPrismaId(body.userId) === true)
      return this.eventHandlerFailure(user, mutedUser.username, WsActionFailure.Mute, WsFailureCause.UserAlreadyMuted)

    this.chat.mute(body.channelName, body.userId, body.seconds)
    return this.eventHandlerSuccess(user, mutedUser.username, WsActionSuccess.Mute)
  }

  afterInit() {
    this.logger.log(WsActionSuccess.Init)
  }

  // guard can't be applied here
  // see https://github.com/nestjs/nest/issues/882
  async handleConnection(@ConnectedSocket() client: Socket) {

    const authHeader: string | undefined = client.request.headers.cookie

    if (authHeader === undefined)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Connect, WsFailureCause.AuthCookieNotFound)

    const tokenData: any = await this.chat.validateUser(authHeader)
    const user: WsUser | undefined = await this.chat.addUser(client.id, tokenData)

    if (user === undefined)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Connect, WsFailureCause.UserNotFound)

    return this.lifecycleHookSuccess(user, WsActionSuccess.Connect)
  }

  // guard can't be applied here
  // see https://github.com/nestjs/nest/issues/882
  async handleDisconnect(@ConnectedSocket() client: Socket) {

    const user: WsUser | undefined = this.chat.getUserBySocketId(client.id)

    if (user === undefined)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Disconnect, WsFailureCause.UserNotFound)

    this.chat.removeUser(user.socketId)

    return this.lifecycleHookSuccess(user, WsActionSuccess.Disconnect)
  }

  eventHandlerSuccess(sender: WsUser, recipient: string, action: WsActionSuccess) {
    this.logger.log(`client ${sender.socketId} (user ${sender.username}) ${action} ${recipient}` as WsHandlerSuccessServerLog)
    return `${action} ${recipient}` as WsHandlerSuccessClientLog
  }

  eventHandlerFailure(sender: WsUser, recipient: string, action: WsActionFailure, cause: WsFailureCause) {
    this.logger.warn(`client ${sender.socketId} (user ${sender.username}) ${action} ${recipient}: ${cause}` as WsHandlerFailureServerLog)
    throw new WsException(`${action} ${recipient}: ${cause}` as WsHandlerFailureClientLog)
  }

  lifecycleHookFailure(id: string, action: WsActionFailure, cause: WsFailureCause) {
    this.logger.warn(`client ${id} ${action}: ${cause}` as WsLifecycleHookFailureServerLog)
    throw new WsException(`${action}: ${cause}` as WsLifecycleHookFailureClientLog)
  }

  lifecycleHookSuccess(user: WsUser, action: WsActionSuccess) {
    this.logger.log(`client ${user.socketId} (user ${user.username}) ${action}` as WsLifecycleHookSuccessServerLog)
    return action as WsLifecycleHookSuccessClientLog
  }

}
