import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Socket, Server } from 'socket.io'

@WebSocketGateway()
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly pongService: PongService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('start')
  startGame(client: Socket) {
    const start: boolean = this.pongService.startGame(client.id);
    if (start)
      this.server.emit('startMessage', {});
  }

  @SubscribeMessage('control')
  handleControls(client: Socket, keyEvent: { press: boolean; key: string }) {
    const side: string = this.pongService.handleControls(client.id, keyEvent.key);
    if (side != 'error')
      this.server.emit('controlMessage', { side: side, press: keyEvent.press, key: keyEvent.key });
  }


  handleConnection(client: Socket) {
    this.pongService.addPlayer(client.id);
  }

  handleDisconnect(client: Socket) {
    const side: string = this.pongService.removePlayer(client.id);
      this.server.emit('disconnectMessage', side);
  }
}
