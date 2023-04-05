import { Game } from '../game/Game';

export class Room {
  id: string;
  game: Game;
  player1: string;
  player2: string;
  watchers: string[];
  start: boolean;
}
