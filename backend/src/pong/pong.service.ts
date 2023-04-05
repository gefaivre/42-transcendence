import { Injectable } from '@nestjs/common';
import { Game } from './game/Game';
import { User } from '@prisma/client';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { Room } from './class/Room';
import { PongUser } from './class/PongUser';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PongService {

  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService) {}

  @WebSocketServer() server: Server;

  rooms: Room[] = [];
  users: PongUser[] = [];


  async validateUser(authHeader: string) {
    const token = authHeader.split('=')[1];
    return this.authService.validateToken(token)
  }

  async addUser(clientId: string, tokenData: any) {
    const user: User | null = await this.usersService.findById(tokenData.sub);

    if (user) {
      this.users.push({ username: user!.username, id: user!.id, clientId: clientId })
      return user.username;
    }
  }

  async removeUser(clientId: string) {
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

  loopGame() {
    let result = this.game.loop();
    if (JSON.stringify(result) !== '{}')
      return false;
    else
      return true;

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
