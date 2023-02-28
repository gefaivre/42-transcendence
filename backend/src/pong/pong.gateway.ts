import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Socket, Server } from 'socket.io'

@WebSocketGateway({
    path: '/pong',
    cors: {
        origin: '*',
    },
})

export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly pongService: PongService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('start')
  startGame(client: Socket) {
    const start: boolean = this.pongService.startGame(client.id);
    if (start) {
      this.server.emit('startMessage');
      this.pongService.loopGame();
    }
  }

  @SubscribeMessage('control')
  handleControls(client: Socket, keyEvent: { press: boolean; key: string }) {
    this.pongService.handleControls(client.id, keyEvent.press, keyEvent.key);
  }

  @SubscribeMessage('getState')
  getGameState() {
    this.pongService.loopGame();
    const payload = this.pongService.getGameState();
    this.server.emit('gameStateMessage', payload);
  }

  handleConnection(client: Socket) {
    this.pongService.addPlayer(client.id);
  }

  handleDisconnect(client: Socket) {
    const side: string = this.pongService.removePlayer(client.id);
      this.server.emit('disconnectMessage', side);
  }
}
