import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { Message } from './class/Message';

@WebSocketGateway({
    path: '/chat',
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(private chatService: ChatService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
    
  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: Message): void {
    this.chatService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  @SubscribeMessage('getMessages')
  getMessages() {
    return this.chatService.getMessages() 
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
