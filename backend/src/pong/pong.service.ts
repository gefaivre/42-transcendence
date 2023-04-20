import { Injectable } from '@nestjs/common';
import { Game } from './game/Game';
import { User } from '@prisma/client';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { Room } from './class/Room';
import { PongUser } from './class/PongUser';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MatchsService } from 'src/matchs/matchs.service';
import { GameStateDto } from './dto/game-state-dto';
import { GameDto } from './dto/game-dto';

@Injectable()
export class PongService {

  constructor(private readonly authService: AuthService,
              private readonly usersService: UsersService,
              private readonly matchsService: MatchsService) {}

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

  async removeUser(clientId: string) : Promise<string | undefined> {
    const user: PongUser | undefined = this.users.find(user => user.clientId === clientId);

    if (user) {
      const room : string | undefined = await this.removeUserFromRoom(user);
      return room;
    }
    return undefined;
  }

  handleRequestGame(clientId: string, friend: string | undefined): string | undefined {
    const user: PongUser | undefined = this.users.find(user => user.clientId === clientId);

    if (user) {
      if (friend) {
        const room : Room | undefined = this.rooms.find(room => room.player1.username === friend);
        if (room) {
          room.player2 = user;
          room.start = true;
          return room.id;
        }
        else 
          this.rooms.push({ id: user.username, player1: user, player2: undefined, game: new Game(600, 400), watchers: [], start: false, ranked: false  });
        return user.username;
      } else {
        const room : Room | undefined = this.rooms.find(room => room.player2 === undefined && room.ranked === true);
        if (room) {
          room.player2 = user;
          room.start = true;
          return room.id;
        }
        else
          this.rooms.push({ id: user.username, player1: user, player2: undefined, game: new Game(600, 400), watchers: [], start: false, ranked: true });
        return user.username;
      }
    }
    return undefined;
  }

  handleWatchGame(clientId: string, game: GameDto) : string | undefined {
    const user: PongUser | undefined = this.users.find(user => user.clientId === clientId);
    const room: Room | undefined = this.rooms.find(room => room.id === game.gameName);

    if (room && user) {
      room.watchers.push(user);
      return room.id;
    }
    return undefined;
  }

  async removeUserFromRoom(user: PongUser) : Promise<string | undefined> {
    const room: Room | undefined = this.rooms.find(room => room.player1 === user || room.player2 === user);
    if (room) {
      if (room.start) {
        await this.registerMatch(room, user);
        const toDelete: number = this.rooms.indexOf(room)
        this.rooms.splice(toDelete, 1);
      }
      return room.id ;
    }
    return undefined;
  }

  async registerMatch(room: Room, loser: PongUser) {
    if (loser === room.player1) {
      await this.matchsService.create({ winnerId: room.player2!.id,
                                      winnerScore: room.game.rightScore, 
                                      loserId: loser.id, 
                                      loserScore: room.game.leftScore, 
                                      date: new Date(), 
                                      ranked: room.ranked })
    } else {
      await this.matchsService.create({ winnerId: room.player1.id,
                                      winnerScore: room.game.leftScore, 
                                      loserId: loser.id, 
                                      loserScore: room.game.rightScore, 
                                      date: new Date(), 
                                      ranked: room.ranked })
    }
  }

  getGamesState(): GameStateDto[] {
    const gamesStateDto: GameStateDto[] = [];
    this.rooms.forEach(room => {
      let result = room.game.loop();
      if (room.start) {
        gamesStateDto.push({ id: room.id, state: room.game.getState() });
      }
      if (JSON.stringify(result) !== '{}')
        this.endMatch(room);
    });
    return gamesStateDto;
  }

  getGameList() : string[] {
    return this.rooms.map(room => room.id);
  }

  async endMatch(room: Room) {
    room.start = false;
    if (room.game.getState().score.leftScore === 10)
      await this.registerMatch(room, room.player2!);
    else
      await this.registerMatch(room, room.player1);
    const toDelete: number = this.rooms.indexOf(room);
    this.rooms.splice(toDelete, 1);
  }

  handleControls(clientId: string, pressed: boolean, key: string) {
    const user: PongUser | undefined = this.users.find(user => user.clientId === clientId);
    const room: Room | undefined = this.rooms.find(room => room.player1 === user || room.player2 === user);

    if (room) {
      if (key === 'w' || key === 'ArrowUp') {
        if (room.player1 === user) {
          if (pressed) 
            room.game.leftPaddle.moveUp();
          else
            room.game.leftPaddle.stop();
        } else {
          if (pressed) 
            room.game.rightPaddle.moveUp();
          else
            room.game.rightPaddle.stop();
        }
      }
      if (key === 's' || key === 'ArrowDown') {
        if (room.player1 === user) {
          if (pressed) 
            room.game.leftPaddle.moveDown();
          else
            room.game.leftPaddle.stop();
        } else {
          if (pressed) 
            room.game.rightPaddle.moveDown();
          else
            room.game.rightPaddle.stop();
        }
      }
    }
  }

}
