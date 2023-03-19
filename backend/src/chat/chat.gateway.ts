import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'
import { ChatService } from './chat.service';
import { PostDto } from './dto/post-dto';
import { ChannelDto } from './dto/channel-dto';
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

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, payload: ChannelDto) {
    const username: string | undefined = this.chatService.getUsername(client.id)

    if (!username) {
      this.server.to(client.id).emit('unauthorized', {user: client.id});
      console.log(`chatWebsocket: client ${client.id} is unauthorized`);
    } else {
      if (this.chatService.isInChannel(username, payload.channelName))
        this.server.to(client.id).emit('error', { message: 'already in channel' });
      else {
        this.chatService.handleJoinChannel(username, payload.channelName);
        client.join(payload.channelName);
        this.server.to(payload.channelName).emit('channelEvent', { user: username, event: 'join' });
        this.server.to(client.id).emit('join', { channelName: payload.channelName});
        const channelPosts: PostEmitDto[] = await this.chatService.retrieveChannelPosts(payload.channelName)
        for (const post of channelPosts)
          this.server.to(client.id).emit('post', post);
      }
    }
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(client: Socket, payload: ChannelDto) {
    const username: string | undefined = this.chatService.getUsername(client.id)

    if (!username) {
      this.server.to(client.id).emit('unauthorized', {user: client.id});
      console.log(`chatWebsocket: client ${client.id} is unauthorized`);
    } else {
      if (!this.chatService.isInChannel(username, payload.channelName))
        this.server.to(client.id).emit('error', { message: 'not in channel' });
      else {
        this.chatService.leaveChannel(username, payload.channelName);
        client.leave(payload.channelName);
        this.server.to(payload.channelName).emit('channelEvent', { user: username, event: 'leave' });
      }
    }
  }
    
  @SubscribeMessage('sendPost')
  handlePost(client: Socket, payload: PostDto): void {
    const username: string | undefined = this.chatService.getUsername(client.id)

    if (!username) {
      this.server.to(client.id).emit('unauthorized', {user: client.id});
      console.log(`chatWebsocket: client ${client.id} is unauthorized`);
    } else {
      this.chatService.registerPost(username, payload);
      const postEmit: PostEmitDto = { channelName: payload.channelName, content: payload.content, author: username }; 
      this.server.to(payload.channelName).emit('post', postEmit);
    }
  }

  afterInit() {
    console.log('chatWebsocket: init');
  }

  async handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) {
      this.server.to(client.id).emit('unauthorized', {user: client.id});
      console.log(`chatWebsocket: client ${client.id} is unauthorized`);
    } else {
      const tokenData = await this.chatService.validateUser(authHeader);
      const username: string | undefined = await this.chatService.addUser(client.id, tokenData);

      if (!username) {
        this.server.to(client.id).emit('unauthorized', {user: client.id});
        console.log(`chatWebsocket: client ${client.id} is unauthorized`);
      } else {
        this.server.to(client.id).emit('welcome', {user: username});
        console.log(`chatWebsocket: user ${username} connected`);
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const username: string | undefined = this.chatService.getUsername(client.id)

    if (!username) {
      this.server.to(client.id).emit('unauthorized', {user: client.id});
      console.log(`chatWebsocket: client ${client.id} is unauthorized`);
    } else {
      const channels: string[] = this.chatService.getUserChannels(username);

      channels.forEach(channel => {
        this.chatService.leaveChannel(username, channel);
        this.server.to(channel).emit('channelEvent', { user: username, event: 'leave' });
      });
      this.chatService.removeUser(username);
    }
  }

}
