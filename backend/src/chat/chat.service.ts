import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { User } from '@prisma/client';
import { Channel } from '@prisma/client';
import { Post } from '@prisma/client';
import { Muted, WsUser } from 'src/types';
import { PostEmitDto } from './dto/post.dto';

@Injectable()
export class ChatService {

  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly channel: ChannelService,
    private readonly posts: PostsService,
  ) {}

  chatUsers: WsUser[] = [];
  muteUsers: Muted[] = [];

  async validateUser(authHeader: string) {
    const token = authHeader.split('=')[1];
    return this.auth.validateToken(token)
  }

  async addUser(socketId: string, tokenData: any): Promise<WsUser | undefined> {
    const user: Omit<User, 'password'> | null = await this.users.findById(tokenData.sub);

    if (user !== null) {
      const chatUser: WsUser = { username: user.username, prismaId: user.id, socketId: socketId }
      this.chatUsers.push(chatUser)
      return chatUser
    }
  }

  // One username can link to multiple clients (this might/should change)
  removeUser(socketId: string) {
    this.chatUsers = this.chatUsers.filter(user => user.socketId !== socketId)
  }

  async retrieveChannelPosts(channelName: string): Promise<PostEmitDto[]> {
    let ret: PostEmitDto[] = [];
    const channel: Channel | null = await this.channel.findByName(channelName);

    if (channel !== null) {
      const posts: Post[] = await this.posts.findByChannel(channel.id);
      for (const post of posts) {
        const author: Omit<User, 'password'> | null = await this.users.findById(post.authorId);
        if (author !== null)
          ret.push({content: post.content, author: author.username, channelName: channelName, date: post.date});
      }
    }
    return ret;
  }

  getUserBySocketId(id: string): WsUser | undefined {
    return this.chatUsers.find(user => user.socketId === id)
  }

  mute(channelName: string, userId: number, seconds: number) {
    this.muteUsers.push({ channelName: channelName, userPrismaId: userId } as Muted)
    const ms: number = seconds * 1000
    setTimeout(() => this.unmute(channelName, userId), ms)
  }

  unmute(channelName: string, userId: number): void {
    this.muteUsers = this.muteUsers.filter((muted: Muted) => muted.channelName !== channelName || muted.userPrismaId !== userId)
  }

  isMutedByPrismaId(id: number): boolean {
    return this.muteUsers.some((muted: Muted) => muted.userPrismaId === id)
  }

}
