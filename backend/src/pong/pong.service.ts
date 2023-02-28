import { Injectable } from '@nestjs/common';
import { Player } from './class/Player';
import { Game } from './game/Game';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class PongService {

  @WebSocketServer() server: Server;

  players: Player[] = [];
  game: Game = new Game(600, 400);

  addPlayer(clientId: string) {
    if (this.players.map(player => player.id).find(id => id === clientId))
      return ;
    if (this.players.length === 0)
      this.players.push({ id: clientId, left: true, start: false });
    else
      this.players.push({id: clientId, left: false, start: false });
    console.log("New player, players = " + this.players);
  }

  removePlayer(clientId: string) {
    const toRemove: number = this.players.map(player => player.id).indexOf(clientId);
    const left: boolean = this.players[toRemove].left;
    if (toRemove > -1) {
      this.players.splice(toRemove, 1);
      console.log("Player removed, players = " + this.players);
      if (left)
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
    if (this.players.filter(player => player.start).length === 2) {
      console.log("game started");
      return true;
    }
    return false;
  }

  @Interval(1000 / 60)
  loopGame() {
    this.game.start();
  }

  handleControls(clientId: string, pressed: boolean, key: string) {
    const player: Player = this.players[this.players.map(player => player.id).indexOf(clientId)];
    if (key === 'w' || key === 'ArrowUp') {
      if (player.left) {
        if (pressed) 
          this.game.leftPaddle.moveUp();
        else
          this.game.leftPaddle.stop();
      } else {
        if (pressed) 
          this.game.rightPaddle.moveUp();
        else
          this.game.rightPaddle.stop();
      }
    }
    if (key === 's' || key === 'ArrowDown') {
      if (player.left) {
        if (pressed) 
          this.game.leftPaddle.moveDown();
        else
          this.game.leftPaddle.stop();
      } else {
        if (pressed) 
          this.game.rightPaddle.moveDown();
        else
          this.game.rightPaddle.stop();
      }
    }
  }

  getGameState() {
    return this.game.getState();
  }
}
