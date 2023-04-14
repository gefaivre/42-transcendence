import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, PrismaService]
})
export class LeaderboardModule {}
