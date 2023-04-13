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
import { PostEmitDto } from './dto/post-emit.dto';
import { ChannelEmitDto } from './dto/channel-emit-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  constructor(private authService: AuthService,
              private usersService: UsersService,
              private channelService: ChannelService,
              private postsService: PostsService) {}

  users: ChatUser[] = [];

  async validateUser(authHeader: string) {
    const token = authHeader.split('=')[1];
    return this.authService.validateToken(token)
  }

  async addUser(clientId: string, tokenData: any): Promise<string | undefined> {
    const user: User | null = await this.usersService.findById(tokenData.sub);

    if (user) {
      this.removeUser(user.username) // avoid duplicates (one username link to multiple ids)
      this.users.push({ username: user!.username, id: user!.id, clientId: clientId })
      return user.username;
    }
  }

  // One username can link to multiple clients (this might/should change)
  removeUser(username: string) {
    this.users = this.users.filter(user => user.username !== username)
  }

  async retrieveChannelPosts(channelName: string): Promise<PostEmitDto[]> {
    let ret: PostEmitDto[] = [];
    const channel: Channel | null = await this.channelService.findByName(channelName);

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

  getUserBySocketId(id: string): ChatUser | undefined {
    return this.users.find(user => user.clientId === id)
  }

  async verifyPassword(channelName: string, password: string): Promise<boolean> {
    const channel = await this.channelService.findByName(channelName)
    if (!channel)
      return false
    return bcrypt.compare(password, channel.password)
  }

}
