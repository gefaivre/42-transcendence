import { WsUser } from '../../types';

export class ChatRoom {
  id: string;
  channelId: number;
  users: WsUser[];
}
