import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { PostDto } from './dto/post-dto';
import { PostEmitDto } from './dto/post-emit.dto';

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
    const post = this.chatService.handlePost(client.id, payload);
    console.log('emit = ' , payload);
    this.server.emit('recPost', post);
  }

  afterInit() {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    this.chatService.handleConnection(client.handshake.headers.authorization)
    .then((userData) => {
      console.log('valid token');
      this.chatService.getUser(userData)
      .then ((user) => {
        console.log('user ', user?.username, ' added in chat');
        this.chatService.addUser(user, client.id)
        .then((user) => {
          this.chatService.getAllChannels(user)
          .then((channels) => {
            channels.forEach((channel) => {
              this.chatService.getChanPosts(channel)
              .then((chanPosts) => {
                chanPosts.forEach((chanPost) => {
                  this.chatService.getAuthor(chanPost)
                  .then((author) => {
                      this.server.emit('recPost', {content: chanPost.content, author: author.username, channelName: channel.name});
                  })
                })
              })
            })
          })
        })
      })
    })
    .catch(() => {
        this.logger.log(`Unauthorized Client: ${client.id}`);
        client.disconnect();
    });
  }

  handleDisconnect(client: Socket) {
    this.chatService.handleDisconnect(client.id);
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
