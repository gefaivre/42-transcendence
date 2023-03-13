import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { PostDto } from './dto/post-dto';
import { PostEmitDto } from './dto/post-emit.dto';

@Injectable()
export class ChatService {
  constructor(private authService: AuthService,
              private usersService: UsersService,
              private channelService: ChannelService,
              private postsService: PostsService) {}
  users: {
    id: number;
    clientId: string;
    username: string;
  }[] = [];

  async handleConnection(authHeader: string | undefined): Promise<any> {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        return this.authService.validateToken(token)
      }
    } else {
      console.log('NoAuthHeader');
    }
    return false;
  }

  handleDisconnect(clientId: string) {
    const index: number = this.users.findIndex(user => user.clientId === clientId);
    this.users.splice(index, 1);
  }
  
  handlePost(clientId: string, payload: PostDto): PostEmitDto | undefined {
    const user = this.users.find(user => user.clientId === clientId);
    if (user) {
      this.channelService.findByName(payload.channelName)
      .then(channel => {
        if (!channel)
          this.channelService.create({name: payload.channelName, ownerId: user.id})
        else
        this.postsService.create({authorId: user.id, channelId: channel.id, content: payload.content});
      })
      return { channelName: payload.channelName, author: user.username, content: payload.content }; 
    }
  }

  async getAllChannels(user: any): Promise<any[]> {
    return this.channelService.findByUser(user.id);
  }
  
  async getChanPosts(channel: any): Promise<any[]> {
    return this.postsService.findByChannel(channel.id);
  }

  async getAuthor(post: any): Promise<any> {
    return this.usersService.findById(post.authorId);
  }

  async getUser(userData: any) {
    return this.usersService.findOne(userData.username);
  }

  async addUser(user: any, clientId: string): Promise<any> {
    this.users.push({id: user.id, clientId: clientId, username: user.username})
    return user;
  }
}
