// import { WsResponse } from "@nestjs/websockets"

export const enum WsActionSuccess {
  Init = 'successfully initialized',
  Connect = 'connected',
  Disconnect = 'disconnected',
  Post = 'posted into channel',
  JoinRoom = 'joined room',
  JoinChannel = 'joined channel',
  LeaveChannel = 'left channel',
}

export const enum WsActionFailure {
  Connect = 'unauthorized to connect',
  Disconnect = 'unauthorized to disconnect',
  Post = 'unauthorized to post to channel',
  JoinRoom = 'unauthorized to join room',
  JoinChannel = 'unauthorized to join channel',
  LeaveChannel = 'unauthorized to leave channel',
}

export const enum WsFailureReason {
  UserNotFound = 'user not found',
  UserNotInChannel = 'user not in channel',
  UserAlreadyJoined = 'user already in channel',
  WrongChannelPassword = 'wrong password',
  PrivateChannel = 'this channel is private',
  AuthCookieNotFound = 'authentication header not found',
}

type UserID = string
type Username = string
type ChannelName = string

export type WsHandlerSuccessClientLog = `${WsActionSuccess} ${ChannelName}`
export type WsHandlerSuccessServerLog = `client ${UserID} (user ${Username}) ${WsHandlerSuccessClientLog}`

export type WsHandlerFailureClientLog = `${WsActionFailure} ${ChannelName}: ${WsFailureReason}`
export type WsHandlerFailureServerLog = `client ${UserID} (user ${Username}) ${WsHandlerFailureClientLog}`

export type WsLifecycleHookSuccessClientLog = WsActionSuccess
export type WsLifecycleHookSuccessServerLog = `client ${UserID} (user ${Username}) ${WsLifecycleHookSuccessClientLog}`

export type WsLifecycleHookFailureClientLog = `${WsActionFailure}: ${WsFailureReason}`
export type WsLifecycleHookFailureServerLog = `client ${UserID} ${WsLifecycleHookFailureClientLog}`

// export class ChatResponse implements WsResponse {
//   event: WsActionSuccess
//   data: WsHandlerSuccessClientLog | WsLifecycleHookSuccessClientLog
// }
