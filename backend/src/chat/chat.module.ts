import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';
import { ChannelModule } from 'src/channel/channel.module';
import { PostsModule } from 'src/posts/posts.module';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [AuthModule, UsersModule, ChannelModule, PostsModule, ChatModule ],
  providers: [ChatGateway, JwtService, PrismaService, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
