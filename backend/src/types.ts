export type WsUser = {
  prismaId: number;
  socketId: string;
  username: string;
}

export const enum Status {
  offline,
  online,
  ingame,
}

export type UserStatus = WsUser & {
  status: Status
}