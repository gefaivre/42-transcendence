import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { PostDto } from './dto/post-dto';

@WebSocketGateway({
    path: '/chat',
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private chatService: ChatService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');
    
  @SubscribeMessage('sendPost')
  handlePost(client: Socket, payload: PostDto): void {
    console.log(payload);
    this.chatService.handlePost(client.id, payload);
    this.server.emit('recPost', payload);
  }

  @SubscribeMessage('getPosts')
  getPosts() {
    const posts = this.chatService.getPosts();
    this.server.emit('recPost', posts);
  }

  afterInit() {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    if (this.chatService.handleConnection(client.id, client.handshake.headers.authorization)) {
        this.logger.log(`Unauthorized Client: ${client.id}`);
        client.disconnect();
    } else {
        this.logger.log(`Client connected: ${client.id}`)
    }
  }

  handleDisconnect(client: Socket) {
    this.chatService.handleDisconnect(client.id);
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
