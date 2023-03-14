import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { PostDto } from './dto/post-dto';
import { Socket } from 'socket.io';
import { User } from '@prisma/client';
import { Channel } from '@prisma/client';
import { Post } from '@prisma/client';
import { ChatUser } from './class/ChatUser';

@Injectable()
export class ChatService {
  constructor(private authService: AuthService,
              private usersService: UsersService,
              private channelService: ChannelService,
              private postsService: PostsService) {}

  users: ChatUser[] = [];

  async handleConnection(authHeader: string | undefined): Promise<any> {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return this.authService.validateToken(token)
      }
    } else {
      console.log('NoAuthHeader');
    }
  }

  handleDisconnect(clientId: string) {
    const index: number = this.users.findIndex(user => user.clientId === clientId);
    this.users.splice(index, 1);
  }
  
  async handlePost(clientId: string, channel: Channel | null, payload: PostDto): Promise<any> {
    const user = this.users.find(user => user.clientId === clientId);
    if (user) {
      if (!channel)
        return this.channelService.create({name: payload.channelName, ownerId: user.id})
      else
        return this.postsService.create({authorId: user.id, channelId: channel.id, content: payload.content});
    }
  }

  async joinChannel(clientId: string, channelName: string, channel: Channel | null): Promise<any> {
    const user = this.users.find(user => user.clientId === clientId);
    if (user) {
      if (!channel)
        return this.channelService.create({name: channelName, ownerId: user.id});
      else
        return this.channelService.addUserToChannel(channel.id, user.id)
    }
  }

  async handleLeaveChannel(client: Socket, channel: Channel): Promise<any> {
    const user = this.users.find(user => user.clientId === client.id);
    if (user) {
      return this.channelService.removeUserFromChannel(channel.id, user.id);
    }
  }
  
  async getChannel(channelName: string): Promise<Channel | null> {
    return this.channelService.findByName(channelName);
  }

  async getAllChannels(user: User): Promise<Channel[]> {
      return this.channelService.findByUser(user.id);
  }

  isInChannel(channelName: string, channel: Channel): boolean {
    return channelName === channel.name;
  }
  
  async getChanPosts(channel: Channel): Promise<Post[]> {
    return this.postsService.findByChannel(channel.id);
  }

  async getAuthor(post: Post): Promise<User | null> {
    return this.usersService.findById(post.authorId);
  }

  async getUser(userData: any): Promise<User | null> {
    return this.usersService.findOne(userData.username);
  }

  async addUser(user: any, clientId: string): Promise<User> {
    this.users.push({id: user.id, clientId: clientId, username: user.username});
    return user;
  }

  getChannelUser(clientId: String): ChatUser | undefined {
    return this.users.find(user => user.clientId === clientId)
  }
}
