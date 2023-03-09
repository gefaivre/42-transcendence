import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Logger, UnauthorizedException, UseGuards} from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { Message } from './class/Message';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
    path: '/chat',
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private chatService: ChatService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`)
    const authHeader : string | undefined = client.handshake.headers.authorization;
    if (authHeader) {
      const clientToken : string = authHeader.split(' ')[1];
      const res = await this.authService.validateSocket(clientToken);
      const user = this.usersService.findOne(res.username);
      if (!user) {
        client.disconnect();
      }
    }
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
