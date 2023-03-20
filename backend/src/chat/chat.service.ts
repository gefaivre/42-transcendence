import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { PostDto } from './dto/post-dto';
import { User } from '@prisma/client';
import { Channel } from '@prisma/client';
import { Post } from '@prisma/client';
import { ChatUser } from './class/ChatUser';
import { ChatChannel } from './class/ChatChannel';
import { PostEmitDto } from './dto/post-emit.dto';
import { ChannelEmitDto } from './dto/channel-emit-dto';

@Injectable()
export class ChatService {
  constructor(private authService: AuthService,
              private usersService: UsersService,
              private channelService: ChannelService,
              private postsService: PostsService) {}

  users: ChatUser[] = [];
  channels: ChatChannel[] = [];

  async validateUser(authHeader: string) {
    const token = authHeader.split('=')[1];
    return this.authService.validateToken(token)
  }

  async addUser(clientId: string, tokenData: any): Promise<string | undefined> {
    const user: User | null = await this.usersService.findOne(tokenData.username);

    if (user) {
      this.users.push({ username: user!.username, id: user!.id, clientId: clientId })
      return user.username;
    }
  }

  removeUser(username: string) {
    const toRemove: number = this.users.findIndex(user => user.username === username);
    this.users.splice(toRemove, 1);
  }

  async createChannel(username: string, channelName: string) {
    const user: ChatUser | undefined = this.users.find(user => user.username === username);
    if (user) {
      await this.channelService.create({name: channelName, ownerId:user.id})
      const newChan = await this.channelService.findByName(channelName);
      this.channels.push({name: channelName, users: [user], id: newChan!.id});
    }
  }

  async joinChannel(username: string, channelName: string) {
    const user: ChatUser | undefined = this.users.find(user => user.username === username);
    const channel: ChatChannel | undefined = this.channels.find(channel => channel.name === channelName);

    if (user && channel) {
      channel.users.push(user);
    } else if (user) {
      const newChan = await this.channelService.findByName(channelName);
      this.channels.push({name: channelName, users: [user], id: newChan!.id});
    }
  }

  leaveChannel(channelName: string, username: string) {
    const channel: ChatChannel | undefined = this.channels.find(channel => channel.name === channelName);

    if (channel) {
      const toRemove: number = channel.users.map(user => user.username).indexOf(username);
      channel.users.splice(toRemove, 1);
    }
  }

  async registerPost(username: string, payload: PostDto) {
    const channel: ChatChannel | undefined = this.channels.find(channel => channel.name === payload.channelName);

    if (channel) {
      const author: ChatUser | undefined = channel.users.find(user => user.username === username);
      if (author) 
        this.postsService.create({content: payload.content, channelId: channel.id, authorId: author.id})
    }
  }
  
  isInChannel(username: string, channelName: string): boolean {
    const channel: ChatChannel | undefined = this.channels.find(channel => channel.name === channelName);
    
    if (channel && channel.users.find(user => user.username === username))
      return true;
    return false;
  }

  getUserChannels(username: string): string[] {
    const res: string[] = [];
    this.channels.forEach(channel => {
      if (this.isInChannel(username, channel.name))
        res.push(channel.name);
    });
    return res;
  }

  async retrieveAllChannels(): Promise<ChannelEmitDto[]> {
    let ret: ChannelEmitDto[] = [];

    const channels: Channel[] = await this.channelService.findAll(); 
    for (const channel of channels) {
      ret.push({channelName: channel.name});
    }
    return ret;
  }

  async retrieveChannelPosts(channelName: string): Promise<PostEmitDto[]> {
    let ret: PostEmitDto[] = [];
    const channel: ChatChannel | undefined = this.channels.find(channel => channel.name === channelName);

    if (channel) {
      const posts: Post[] = await this.postsService.findByChannel(channel.id);
      for (const post of posts) {
        const author: User | null = await this.usersService.findById(post.authorId);
        if (author)
          ret.push({content: post.content, author: author.username, channelName: channelName}); 
      }
    }
    return ret;
  }
  
  getUsername(clientId: string): string | undefined {
    const user = this.users.find(user => user.clientId === clientId);
    if (user)
      return user.username;
  }

}
