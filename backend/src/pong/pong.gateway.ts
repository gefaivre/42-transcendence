import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Socket, Server } from 'socket.io'
import { Interval, Cron } from '@nestjs/schedule';

@WebSocketGateway({
    path: '/pong',
    cors: {
        origin: '*',
    },
})

export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly pongService: PongService) {}

  @WebSocketServer() server: Server;

  start: boolean = false;

  @SubscribeMessage('start')
  startGame(client: Socket) {
    const start: boolean = this.pongService.startGame(client.id);
    if (start) {
      this.server.emit('startMessage');
      this.start = true;
    }
  }

  @SubscribeMessage('control')
  handleControls(client: Socket, keyEvent: { press: boolean; key: string }) {
    this.pongService.handleControls(client.id, keyEvent.press, keyEvent.key);
  }

  @Interval(1000 / 120)
  getGameState() {
    if (this.start) {
      this.pongService.loopGame();
      const payload = this.pongService.getGameState();
      this.server.emit('gameStateMessage', payload);
    }
  }

  handleConnection(client: Socket) {
    this.pongService.addPlayer(client.id);
  }

  handleDisconnect(client: Socket) {
    const side: string = this.pongService.removePlayer(client.id);
    this.server.emit('disconnectMessage', side);
    this.start = false;
  }
}
