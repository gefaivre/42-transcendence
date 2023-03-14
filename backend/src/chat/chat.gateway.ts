import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { PostDto } from './dto/post-dto';
import { ChannelDto } from './dto/channel-dto';

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

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, payload: ChannelDto) {
    this.chatService.getChannel(payload.channelName)
    .then((channel) => {
      this.chatService.getUser(this.chatService.getChannelUser(client.id)?.username);
      .then(user => {
      this.chatService.getAllChannels(user!)
      .then(channels => {
        channels.forEach(channel => {
          if (this.chatService.isInChannel(payload.channelName, channel))
            return ;
        })
        this.chatService.joinChannel(client.id, payload.channelName, channel)
        .then(() => {
          client.join(payload.channelName);
          this.server.to(payload.channelName).emit('recJoin', {channelName: payload.channelName, message: 'channel joined by ' + this.chatService.getChannelUser(client.id)?.username});
          console.log(this.chatService.getChannelUser(client.id)?.username, ' has joined channel ', payload.channelName);
          this.chatService.getChannel(payload.channelName)
          .then((channel) => {
            this.chatService.getChanPosts(channel!)
            .then((chanPosts) => {
              chanPosts.forEach(post => {
              this.chatService.getAuthor(post)
                .then((author) => {
                this.server.to(client.id).emit('recPost', {content: post.content, author: author!.username, channelName: channel!.name});
                })
              })
              })
            })
          })
        })
      })
    })
  }

  @SubscribeMessage('leaveChannel')
  handleLeaveChannel(client: Socket, payload: ChannelDto) {
    this.chatService.getChannel(payload.channelName)
    .then(channel => {
      if (channel) {
        this.chatService.handleLeaveChannel(client, channel)
        .then(() => {
          client.leave(payload.channelName);
          this.server.to(payload.channelName).emit('recLeave', {channelName: payload.channelName, message: 'channel left by ' + this.chatService.getChannelUser(client.id)?.username});
          console.log(this.chatService.getChannelUser(client.id)?.username, ' has left channel ', payload.channelName);
        })
      }
    })
  }
    
  @SubscribeMessage('sendPost')
  handlePost(client: Socket, payload: PostDto): void {
    this.chatService.getChannel(payload.channelName)
    .then((channel) => {
      this.chatService.handlePost(client.id, channel, payload)
      .then(() => {
        this.server.to(payload.channelName).emit('recPost', { channelName: payload.channelName, content: payload.content, author: this.chatService.getChannelUser(client.id)?.username});
      });
    })
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
                      this.server.to(client.id).emit('recPost', {content: chanPost.content, author: author!.username, channelName: channel.name});
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
