import { Controller, Get } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('mmr')
  topMmr() {
    return this.leaderboardService.getTopMmr();
  }

  @Get('games')
  topGames() {
    return this.leaderboardService.getTopGames();
  }
}
