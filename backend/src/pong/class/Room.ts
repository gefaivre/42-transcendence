import { Game } from '../game/Game';
import { WsUser } from 'src/types';

export class Room {
  id: string;
  game: Game;
  player1: WsUser;
  player2: WsUser | undefined;
  watchers: WsUser[];
  start: boolean;
  ranked: boolean;
}
