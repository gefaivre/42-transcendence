import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { PongService } from './pong.service';
import { Socket, Server } from 'socket.io'
import { Message } from './class/Message';

@WebSocketGateway()
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly pongService: PongService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('start')
  startGame(client: Socket) {
    let start: boolean = this.pongService.startGame(client);
    if (start)
      this.server.emit('startMessage', {});
  }

  @SubscribeMessage('control')
  handleControls(client: Socket, payload: Message) {
    const message: Message = this.pongService.handleControls(payload);
    this.server.emit('controlMessage', message);
  }


  handleConnection(client: Socket, ...args: any[]) {
    this.pongService.addPlayer(client.id);
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.pongService.removePlayer(client.id);
  }
}
