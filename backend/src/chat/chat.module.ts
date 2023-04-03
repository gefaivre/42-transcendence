import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChannelModule } from 'src/channel/channel.module';
import { PostsModule } from 'src/posts/posts.module';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';
import { UsersService } from 'src/users/users.service';
import { PostsService } from 'src/posts/posts.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesService } from 'src/images/images.service';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [AuthModule, UsersModule, ChannelModule, PostsModule, ImagesModule],
  providers: [ChatGateway, ChatService, JwtService, PrismaService],
  exports: [ChatService]
})
export class ChatModule {}
