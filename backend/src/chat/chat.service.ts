import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { PostDto } from './dto/post-dto';

@Injectable()
export class ChatService {
  constructor(private authService: AuthService,
              private userService: UsersService,
              private channelService: ChannelService,
              private postsService: PostsService) {}
  users: {
    id: number;
    clientId: string;
    username: string;
  }[] = [];

  handleConnection(clientId: string, authHeader: string | undefined) {
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        this.authService.validateToken(token)
        .then(data => {
          this.addUser(data, clientId);
          return true;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
      }
    }
    return false;
  }

  handleDisconnect(clientId: string) {
    const index: number = this.users.findIndex(user => user.clientId === clientId);
    this.users.splice(index, 1);
  }
  
  handlePost(clientId: string, payload: PostDto) {
    const user = this.users.find(user => user.clientId === clientId);
    if (user) {
      this.channelService.findOne(payload.channelId)
      .then(channel => {
        if (!channel)
          this.channelService.create({name: 'test' + payload.channelId.toString(), ownerId: user.id})
        this.postsService.create({authorId: user.id, channelId: payload.channelId, content: payload.content});
      })
    }
  }

  getPosts() {
      this.postsService.findAll();
  }

  addUser(userToken: any, clientId: string) {
    this.userService.findOne(userToken.username)
    .then(user => {
      if (user) {
        this.users.push({id: user.id, clientId: clientId, username: user.username});
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
}
