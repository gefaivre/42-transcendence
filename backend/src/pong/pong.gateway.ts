import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Socket, Server } from 'socket.io'
import { Interval } from '@nestjs/schedule';
import { KeyEventDto } from './dto/key-event-dto';
import { RequestGameDto } from './dto/request-game-dto';
import { GameStateDto } from './dto/game-state-dto';
import { GameDto } from './dto/game-dto';
import { RoomDto } from './dto/room-dto';

@WebSocketGateway({
    path: '/pong',
    cors: {
        origin: 'http://localhost:8080',
        credentials: true
    },
})

export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly pongService: PongService) {}

  @WebSocketServer() server: Server;


  @SubscribeMessage('requestGame')
  handleRequestGame(client: Socket, requestGameDto: RequestGameDto) {
    const room: string | undefined = this.pongService.handleRequestGame(client.id, requestGameDto.friend);
    if (!room) {
      const username: string | undefined = this.pongService.getUsername(client.id);
      if (username)
        client.join(username);
    } else {
      client.join(room);
      const players = this.pongService.getRoomPlayers(room);
      this.server.to(room).emit('gameStart', players);
    }
  }

  @SubscribeMessage('control')
  handleControls(client: Socket, keyEventDto: KeyEventDto) {
    this.pongService.handleControls(client.id, keyEventDto.press, keyEventDto.key);
  }

  @SubscribeMessage('watchGame')
  handleWatchGame(client: Socket, game: GameDto) {
    const room: string | undefined = this.pongService.handleWatchGame(client.id, game);
    if (room) {
      client.join(room);
      this.server.to(client.id).emit('watchGame', { response: true });
    } else {
      this.server.to(client.id).emit('watchGame', { response: false });
    }
  }

  @Interval(1000 / 120)
  sendGameState() {
    const gamesState: GameStateDto[] = this.pongService.getGamesState();
    gamesState.forEach(game => {
      this.server.to(game.id).emit('gameState', game.state);
      if (game.state.score.leftScore === 10 || game.state.score.rightScore === 10) {
        const winnerId: string = this.pongService.getWinner(game.id);
        this.server.to(winnerId).emit('win', {});
        const loserId: string = this.pongService.getLoser(game.id);
        this.server.to(loserId).emit('lose', {});
      }
    });
  }

  async handleConnection(client: Socket) {
    const authHeader = client.request.headers.cookie;

    if (!authHeader) {
      this.server.to(client.id).emit('unauthorized', { user: client.id });
      console.log(`pongWebsocket: client ${client.id} is unauthorized`);
    } else {
      const tokenData = await this.pongService.validateUser(authHeader);
      const username: string | undefined = await this.pongService.addUser(client.id, tokenData);
      
      if (!username) {
        this.server.to(client.id).emit('unauthorized', { user: client.id });
        console.log(`pongWebsocket: client ${client.id} is unauthorized`);
      } else {
        this.server.to(client.id).emit('welcome', { user: client.id });
        const roomList : RoomDto[] = this.pongService.getRoomList();
        this.server.to(client.id).emit('gameList', { gameList: roomList });
        console.log(`pongWebsocket: user ${username} connected`);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const room: string | undefined = await this.pongService.removeUser(client.id);
    if (room) {
      const username = this.pongService.getUsername(client.id);
      client.leave(room);
      this.server.to(room).emit('opponentLeft', {username: username});
    }
  }
}
