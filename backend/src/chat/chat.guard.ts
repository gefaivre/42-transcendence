import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Socket } from 'socket.io'
import { ChatService } from "./chat.service";
import { ChannelDto } from "./dto/channel.dto";
import { PostDto } from "./dto/post.dto";
import { WsException } from "@nestjs/websockets";
import { WsActionFailure, WsFailureReason, WsHandlerFailureServerLog, WsHandlerFailureClientLog, WsLifecycleHookFailureServerLog, WsLifecycleHookFailureClientLog } from "./types/types"
import { ChannelService } from "src/channel/channel.service";
import { ChatUser } from "./class/ChatUser";

@Injectable()
export class ChatGuard implements CanActivate {

  private readonly logger: Logger = new Logger(ChatGuard.name, { timestamp: true })

  constructor(
    private readonly chatService: ChatService,
    private readonly channelService: ChannelService
  ) {}

  eventHandlerFailure(id: string, username: string, channel: string, action: WsActionFailure, reason: WsFailureReason) {
    this.logger.warn(`client ${id} (user ${username}) ${action} ${channel}: ${reason}` as WsHandlerFailureServerLog)
    throw new WsException(`${action} ${channel}: ${reason}` as WsHandlerFailureClientLog)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const handler: string = context.getHandler().name
    const client: Socket = context.switchToWs().getClient<Socket>()
    const user: ChatUser | undefined = this.chatService.getUserBySocketId(client.id)

    // yes, this is a `lifecycleHookFailure()` doppelganger even if we not into a lifecycle hook
    if (user === undefined) {
      this.logger.warn(`client ${client.id} ${WsActionFailure.Connect}: ${WsFailureReason.UserNotFound}` as WsLifecycleHookFailureServerLog)
      throw new WsException(`${WsActionFailure.Connect}: ${WsFailureReason.UserNotFound}` as WsLifecycleHookFailureClientLog)
    }

    if (handler === 'handleJoinChannel') {

      // verify channel existence
      const channel: ChannelDto = context.getArgByIndex(1)
      if (await this.channelService.findByName(channel.channelName) === null)
        this.eventHandlerFailure(client.id, user.username, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.ChannelNotFound)

      // verify channel membership
      const isInChannel: boolean = await this.channelService.isInChannel(channel.channelName, user.prismaId)
      if (isInChannel === true)
        this.eventHandlerFailure(client.id, user.username, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.UserAlreadyJoined)

      // verify channel password
      else if (channel.status === 'Protected') {
        if (await this.chatService.verifyPassword(channel.channelName, channel.password) === false) {
          this.eventHandlerFailure(client.id, user.username, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.WrongChannelPassword)
        }
      }

      // TODO
      else if (channel.status === 'Private') {
        this.eventHandlerFailure(client.id, user.username, channel.channelName, WsActionFailure.JoinChannel, WsFailureReason.PrivateChannel)
      }
    }

    else if (handler === 'handleJoinRoom') {

      // verify channel existence
      const room: string = context.getArgByIndex(1)
      if (await this.channelService.findByName(room) === null)
        this.eventHandlerFailure(client.id, user.username, room, WsActionFailure.JoinRoom, WsFailureReason.ChannelNotFound)

      // verify channel membership
      const isInChannel: boolean = await this.channelService.isInChannel(room, user.prismaId)
      if (isInChannel === false)
        this.eventHandlerFailure(client.id, user.username, room, WsActionFailure.JoinRoom, WsFailureReason.UserNotInChannel)
    }

    else if (handler === 'handleLeaveChannel') {

      // verify channel existence
      const channel: string = context.getArgByIndex(1)
      if (await this.channelService.findByName(channel) === null)
        this.eventHandlerFailure(client.id, user.username, channel, WsActionFailure.LeaveChannel, WsFailureReason.ChannelNotFound)

      // verify channel membership
      const isInChannel: boolean = await this.channelService.isInChannel(channel, user.prismaId)
      if (isInChannel === false)
        this.eventHandlerFailure(client.id, user.username, channel, WsActionFailure.LeaveChannel, WsFailureReason.UserNotInChannel)
    }

    else if (handler === 'sendPost') {

      // verify channel existence
      const post: PostDto = context.getArgByIndex(1)
      if (await this.channelService.findByName(post.channelName) === null)
        this.eventHandlerFailure(client.id, user.username, post.channelName, WsActionFailure.Post, WsFailureReason.ChannelNotFound)

      // verify channel membership
      const isInChannel: boolean = await this.channelService.isInChannel(post.channelName, user.prismaId)
      if (isInChannel === false)
        this.eventHandlerFailure(client.id, user.username, post.channelName, WsActionFailure.Post, WsFailureReason.UserNotInChannel)
    }

    return true
  }

}