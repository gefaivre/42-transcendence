import { Injectable } from '@nestjs/common';
import { Game } from './game/Game';
import { User } from '@prisma/client';
import { Room } from './types/Room';
import { Settings } from './types/Settings';
import { WsUser } from 'src/types';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { MatchsService } from 'src/matchs/matchs.service';
import { GameStateDto } from './dto/game-state.dto';
import { GameDto } from './dto/game.dto';
import { RoomDto } from './dto/room.dto';

@Injectable()
export class PongService {

  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly matchs: MatchsService
  ) {}

  rooms: Room[] = [];
  pongUsers: WsUser[] = [];

  async validateUser(authHeader: string) {
    const token = authHeader.split('=')[1];
    return this.auth.validateToken(token)
  }

  async addUser(socketId: string, tokenData: any) {
    const user: Omit<User, 'password'> | null = await this.users.findById(tokenData.sub);

    if (user !== null) {
      this.pongUsers.push({ username: user!.username, prismaId: user!.id, socketId: socketId })
      return user.username;
    }
  }

  async removeUser(socketId: string) : Promise<string | undefined> {
    const user: WsUser | undefined = this.pongUsers.find(user => user.socketId === socketId);

    if (user !== undefined) {
      const room : string | undefined = await this.removeUserFromRoom(user);
      return room;
    }
    return undefined;
  }

  handleRequestGame(socketId: string, friend: string | undefined, settings: Settings): string | undefined {
    const user: WsUser | undefined = this.pongUsers.find(user => user.socketId === socketId);

    if (user !== undefined) {
      if (friend !== undefined) {
        const room : Room | undefined = this.rooms.find(room => room.player1.username === friend);
        if (room !== undefined) {
          room.player2 = user;
          room.start = true;
          return room.id;
        }
        else
          this.rooms.push({ id: user.username, player1: user, player2: undefined, game: new Game(600, 400, settings), watchers: [], start: false, ranked: false, settings: settings  });
        return undefined;
      } else {
        const room : Room | undefined = this.rooms.find(room => room.player2 === undefined && room.ranked === true && room.settings === settings);
        if (room !== undefined) {
          room.player2 = user;
          room.start = true;
          return room.id;
        }
        else
          this.rooms.push({ id: user.username, player1: user, player2: undefined, game: new Game(600, 400, settings), watchers: [], start: false, ranked: true, settings: settings});
        return undefined;
      }
    }
    return undefined;
  }

  cancelRequest(socketId: string) {
    const user: WsUser | undefined = this.pongUsers.find(user => user.socketId === socketId);

    if (user !== undefined) {
      const room: Room | undefined = this.rooms.find(room => room.player1 === user);
      if (room !== undefined) {
          const toDelete: number = this.rooms.indexOf(room);
          this.rooms.splice(toDelete, 1);
      }
    }

  }

  handleWatchGame(socketId: string, game: GameDto) : string | undefined {
    const user: WsUser | undefined = this.pongUsers.find(user => user.socketId === socketId);
    const room: Room | undefined = this.rooms.find(room => room.id === game.gameName);

    if (room !== undefined && user !== undefined) {
      room.watchers.push(user);
      return room.id;
    }
    return undefined;
  }

  async removeUserFromRoom(user: WsUser) : Promise<string | undefined> {
    const room: Room | undefined = this.rooms.find(room => room.player1 === user || room.player2 === user);
    if (room !== undefined) {
      if (room.start === true) {
        await this.registerMatch(room, user);
        const toDelete: number = this.rooms.indexOf(room)
        this.rooms.splice(toDelete, 1);
      }
      return room.id ;
    }
    return undefined;
  }

  async registerMatch(room: Room, loser: WsUser) {
    await this.updateMmr(room, loser);
    if (loser === room.player1) {
      await this.matchs.create({ winnerId: room.player2!.prismaId,
                                      winnerScore: room.game.rightScore,
                                      loserId: loser.prismaId,
                                      loserScore: room.game.leftScore,
                                      ranked: room.ranked })
    } else {
      await this.matchs.create({ winnerId: room.player1.prismaId,
                                      winnerScore: room.game.leftScore,
                                      loserId: loser.prismaId,
                                      loserScore: room.game.rightScore,
                                      ranked: room.ranked })
    }
  }

  getGamesState(): GameStateDto[] {
    const gamesStateDto: GameStateDto[] = [];
    this.rooms.forEach(room => {
      if (room.start === true) {
        let result = room.game.loop();
        gamesStateDto.push({ id: room.id, state: room.game.getState() });
        if (JSON.stringify(result) !== '{}')
         this.endMatch(room);
      }
    });
    return gamesStateDto;
  }

  getRoomList() : RoomDto[] {
    let roomList: RoomDto[] = [];

    this.rooms.forEach(room => {
      if (room.start === true)
        roomList.push({roomId: room.id, player1: room.player1.username, player2: room.player2!.username});
    });
    return roomList;
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

  handleControls(socketId: string, pressed: boolean, key: string) {
    const user: WsUser | undefined = this.pongUsers.find(user => user.socketId === socketId);
    const room: Room | undefined = this.rooms.find(room => room.player1 === user || room.player2 === user);

    if (room !== undefined) {
      if (key === 'w' || key === 'ArrowUp') {
        if (room.player1 === user) {
          if (pressed === true)
            room.game.leftPaddle.moveUp();
          else
            room.game.leftPaddle.stop();
        } else {
          if (pressed === true)
            room.game.rightPaddle.moveUp();
          else
            room.game.rightPaddle.stop();
        }
      }
      if (key === 's' || key === 'ArrowDown') {
        if (room.player1 === user) {
          if (pressed === true)
            room.game.leftPaddle.moveDown();
          else
            room.game.leftPaddle.stop();
        } else {
          if (pressed === true)
            room.game.rightPaddle.moveDown();
          else
            room.game.rightPaddle.stop();
        }
      }
    }
  }

  getWinner(roomId: string) : string {
    const room: Room | undefined = this.rooms.find(room => room.id === roomId)
    if (room !== undefined) {
      if (room.game.leftScore === 10)
        return room.player1.socketId;
      else
        return room.player2!.socketId;
    }
    return '';
  }

  getLoser(roomId: string) : string {
    const room: Room | undefined = this.rooms.find(room => room.id === roomId)
    if (room !== undefined) {
      if (room.game.leftScore === 10)
        return room.player2!.socketId;
      else
        return room.player1.socketId;
    }
    return '';
  }

  getUsername(socketId: string) : string  | undefined {
    const user: WsUser | undefined = this.pongUsers.find(user => user.socketId === socketId);
    if (user !== undefined)
      return user.username;
  }

  getUserBySocketId(id: string) {
    return this.pongUsers.find(user => user.socketId === id)
  }

  getRoomPlayers(roomId: string) : { player1: string; player2: string } | undefined {
    const room: Room | undefined = this.rooms.find(room => room.id === roomId)
    if (room !== undefined && room.player2 !== undefined) {
      return { player1: room.player1.username, player2: room.player2.username }
    }
  }

  async updateMmr(room: Room, loserWsUser: WsUser) {
    const loser: Omit<User, 'password'> | null = await this.users.findById(loserWsUser.prismaId);
    const winner: Omit<User, 'password'> | null  = await this.users.findById(room.player2!.prismaId);

    if (loser !== null && winner !== null) {
      const R1: number = 10 ** (loser.mmr / 400);
      const R2: number = 10 ** (winner.mmr / 400);

      const E1: number = R1 / (R1 + R2);
      const E2: number = R2/ (R1 + R2);

      const loserMmr = Math.round(loser.mmr + 32 * (0 - E1));
      const winnerMmr = Math.round(winner.mmr + 32 * (1 - E2));

      await this.users.update(loser.username, {games: loser.games + 1, mmr: loserMmr});
      await this.users.update(winner.username, {games: winner.games + 1, mmr: winnerMmr});
    }
  }

}
