import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Socket, Server } from 'socket.io'
import { Interval } from '@nestjs/schedule';
import { KeyEventDto } from './dto/key-event-dto';

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
  handleRequestGame(client: Socket) {
    const response: responseDto = this.pongService.handleRequestGame(client.id);
    this.server.to(response.room).emit('requestGame', response.payload);
  }

  @SubscribeMessage('start')
  handleStartGame(client: Socket) {
    const response: responseDto = this.pongService.handleStartGame(client.id);
    this.server.to(response.room).emit('startGame', response.payload);
  }

  @SubscribeMessage('control')
  handleControls(client: Socket, keyEventDto: KeyEventDto) {
    this.pongService.handleControls(client.id, keyEventDto.press, keyEventDto.key);
  }

  @SubscribeMessage('watchGame')
  handleWatchGame(client: Socket, game: gameDto) {
    this.pongService.handleWatchGame(client.id, game);
    this.server.to(client.id).emit('watchGame', { response: true });
  }

  @Interval(1000 / 120)
  sendGameState() {
    const gamesState: GameStateDto[] = this.pongService.getGamesState();
    gamesState.forEach(game => {
      this.server.to(game.id).emit(game.state);
    });
  }

  handleConnection(client: Socket) {
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
        console.log(`pongWebsocket: user ${username} connected`);
      }
    }
  }

  handleDisconnect(client: Socket) {
    const response: responseDto = this.pongService.removePlayer(client.id);
    this.server.to(response.room).emit('disconnect', response.payload);
  }
}
