import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Socket } from 'socket.io'
import { ChatService } from "./chat.service";
import { ChannelDto } from "./dto/channel-dto";
import { PostDto } from "./dto/post-dto";
import { WsException } from "@nestjs/websockets";
import { WsActionFailure, WsFailureReason, WsHandlerFailureServerLog, WsHandlerFailureClientLog, WsLifecycleHookFailureServerLog, WsLifecycleHookFailureClientLog } from "./types/types"

@Injectable()
export class ChatGuard implements CanActivate {

  private readonly logger: Logger = new Logger(ChatGuard.name, { timestamp: true })

  constructor(private readonly chatService: ChatService) {}

  eventHandlerFailure(id: string, username: string, channel: string, action: WsActionFailure, reason: WsFailureReason) {
    this.logger.warn(`client ${id} (user ${username}) ${action} ${channel}: ${reason}` as WsHandlerFailureServerLog)
    throw new WsException(`${action} ${channel}: ${reason}` as WsHandlerFailureClientLog)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const handler: string = context.getHandler().name
    const client: Socket = context.switchToWs().getClient<Socket>()
    const username: string | undefined = this.chatService.getUsername(client.id)

    // yes, this is a `lifecycleHookFailure()` doppelganger even if we not into a lifecycle hook
    if (!username) {
      this.logger.warn(`client ${client.id} ${WsActionFailure.Connect}: ${WsFailureReason.UserNotFound}` as WsLifecycleHookFailureServerLog)
      throw new WsException(`${WsActionFailure.Connect}: ${WsFailureReason.UserNotFound}` as WsLifecycleHookFailureClientLog)
    }

    if (handler === 'handleJoinChannel') {

      const channel: ChannelDto = context.getArgByIndex(1)
      const isInChannel: boolean = await this.chatService.isInChannel(username, channel.channelName)

      if (isInChannel === true) {
        this.eventHandlerFailure(client.id, username, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.UserAlreadyJoined)
      }

      else if (channel.status === 'Protected') {
        if (await this.chatService.verifyPassword(channel.channelName, channel.password) === false) {
          this.eventHandlerFailure(client.id, username, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.WrongChannelPassword)
        }
      }

      // TODO
      else if (channel.status === 'Private') {
        this.eventHandlerFailure(client.id, username, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.PrivateChannel)
      }
    }

    else if (handler === 'handleJoinRoom') {
      const room: string = context.getArgByIndex(1)
      const isInChannel: boolean = await this.chatService.isInChannel(username, room)
      if (isInChannel === false) {
        this.eventHandlerFailure(client.id, username, room, WsActionFailure.JoinRoom, WsFailureReason.UserNotInChannel)
      }
    }

    else if (handler === 'handleLeaveChannel') {
      const channel: string = context.getArgByIndex(1)
      const isInChannel: boolean = await this.chatService.isInChannel(username, channel)
      if (isInChannel === false) {
        this.eventHandlerFailure(client.id, username, channel, WsActionFailure.LeaveChannel, WsFailureReason.UserNotInChannel)
      }
    }

    else if (handler === 'sendPost') {
      const post: PostDto = context.getArgByIndex(1)
      const isInChannel: boolean = await this.chatService.isInChannel(username, post.channelName)
      if (isInChannel === false) {
        this.eventHandlerFailure(client.id, username, post.channelName, WsActionFailure.Post, WsFailureReason.UserNotInChannel)
      }
    }

    return true
  }

}