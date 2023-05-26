import { Module } from '@nestjs/common';
import { PongModule } from './pong/pong.module';
import { ChatModule } from './chat/chat.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { MatchsModule } from './matchs/matchs.module';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ImagesModule } from './images/images.module';
import { PostsModule } from './posts/posts.module';
import { ImagesService } from './images/images.service';

@Module({
  imports: [UsersModule, MatchsModule,AuthModule, ChannelModule, ChatModule, PostsModule, ImagesModule, PongModule],
  providers: [PrismaService, ImagesService]
})
export class AppModule {}
