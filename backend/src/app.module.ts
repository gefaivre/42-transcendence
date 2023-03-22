import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MatchsModule } from './matchs/matchs.module';
import { AuthModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ChannelModule } from './channel/channel.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [PrismaModule, UsersModule, MatchsModule,AuthModule, LeaderboardModule, ChannelModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
