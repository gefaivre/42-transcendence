import { Game } from '../game/Game';
import { PongUser } from './PongUser';

export class Room {
  id: string;
  game: Game;
  player1: PongUser;
  player2: PongUser | undefined;
  watchers: string[];
  start: boolean;
  ranked: boolean;
}
