import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { Channel } from '@prisma/client';
import { Post } from '@prisma/client';
import { ChatUser } from './class/ChatUser';
import { PostEmitDto } from './dto/post.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
    private readonly postsService: PostsService,
  ) {}

  users: ChatUser[] = [];

  async validateUser(authHeader: string) {
    const token = authHeader.split('=')[1];
    return this.authService.validateToken(token)
  }

  async addUser(socketId: string, tokenData: any): Promise<ChatUser | undefined> {
    const user: Omit<User, 'password'> | null = await this.usersService.findById(tokenData.sub);

    if (user) {
      this.removeUser(user.username) // avoid duplicates (one username link to multiple ids)
      const chatUser: ChatUser = { username: user.username, prismaId: user.id, socketId: socketId }
      this.users.push(chatUser)
      return chatUser
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
        const author: Omit<User, 'password'> | null = await this.usersService.findById(post.authorId);
        if (author)
          ret.push({content: post.content, author: author.username, channelName: channelName, date: post.date});
      }
    }
    return ret;
  }

  getUserBySocketId(id: string): ChatUser | undefined {
    return this.users.find(user => user.socketId === id)
  }

  async verifyPassword(channelName: string, password: string): Promise<boolean> {
    const channel = await this.channelService.findByName(channelName)
    if (channel === null)
      return false
    return bcrypt.compare(password, channel.password)
  }

}
