import { Injectable } from '@nestjs/common';
import { Player } from './class/Player';

@Injectable()
export class PongService {

  players: Player[] = [];

  addPlayer(clientId: string) {
    if (this.players.length === 0)
      this.players.push({ id: clientId, left: true, start: false });
    else
      this.players.push({id: clientId, left: false, start: false });
  }

  removePlayer(clientId: string) {
    const toRemove: number = this.players.map(player => player.id).indexOf(clientId);
    if (toRemove > -1) {
      this.players.splice(toRemove, 1);
      if (this.players[toRemove].left === true)
        return 'left';
      else
        return 'right';
    }
    else
      return 'error';
  }

  startGame(clientId: string) {
    const toStart: number = this.players.map(player => player.id).indexOf(clientId);
    this.players[toStart].start = true;
    if (this.players.filter(player => player.start).length === 2)
      return true;
    else
      return false;
  }

  handleControls(clientId: string, key: string) {
    const player: Player = this.players[this.players.map(player => player.id).indexOf(clientId)];
    if (key === 'ArrowUp' || key === 'w' || key == 'ArrowDown' || key == 's') {
      if (player.left)
        return 'left';
      else
        return 'right';
    } else
      return 'error';
  }

}
