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

  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {

    // Since `ChatGuard` has been applied we assume `username` is not undefined
    const username: string = this.chatService.getUsername(client.id) as string

    client.join(room)

    // TODO: add listener for this event in the frontend
    this.server.to(room).emit('channelEvent', { user: username, event: 'join' })

    const channelPosts: PostEmitDto[] = await this.chatService.retrieveChannelPosts(room)
    for (const post of channelPosts)
      client.emit('post', post)

    return this.eventHandlerSuccess(client.id, username, room, WsActionSuccess.JoinRoom)
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: ChannelDto) {

    // Since `ChatGuard` has been applied we assume `username` is not undefined
    const username: string = this.chatService.getUsername(client.id) as string

    // TODO (?): try/catch
    await this.chatService.joinChannel(username, channel.channelName)

    return this.eventHandlerSuccess(client.id, username, channel.channelName, WsActionSuccess.JoinChannel)
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channel: string) {

    // Since `ChatGuard` has been applied we assume `username` is not undefined
    const username: string = this.chatService.getUsername(client.id) as string

    // TODO (?): try/catch
    await this.chatService.leaveChannel(username, channel)

    client.leave(channel)

    // TODO: add listener for this event in the frontend
    this.server.to(channel).emit('channelEvent', { user: username, event: 'leave' })

    return this.eventHandlerSuccess(client.id, username, channel, WsActionSuccess.LeaveChannel)
  }

  @SubscribeMessage('sendPost')
  async handlePost(@ConnectedSocket() client: Socket, @MessageBody() post: PostDto) {

    // Since `ChatGuard` has been applied we assume `username` is not undefined
    const username: string = this.chatService.getUsername(client.id) as string

    // TODO (?): try/catch
    await this.chatService.registerPost(username, post)

    this.server.to(post.channelName).emit('post', {
      channelName: post.channelName,
      content: post.content,
      author: username
    } as PostEmitDto)

    return this.eventHandlerSuccess(client.id, username, post.channelName, WsActionSuccess.Post)
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

    console.log('users:', this.chatService.users)

    const username: string | undefined = this.chatService.getUsername(client.id)

    if (!username)
      return this.lifecycleHookFailure(client.id, WsActionFailure.Disconnect, WsFailureReason.UserNotFound)

    this.chatService.removeUser(username as string)

    return this.lifecycleHookSuccess(client.id, username, WsActionSuccess.Disconnect)
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
