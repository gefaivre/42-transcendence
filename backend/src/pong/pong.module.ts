import { Module } from '@nestjs/common';
import { PongService } from './pong.service';
import { PongGateway } from './pong.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { MatchsModule } from 'src/matchs/matchs.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MatchsService } from 'src/matchs/matchs.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    MatchsModule,
    PrismaModule
  ],
  providers: [PongGateway, PongService, MatchsService, PrismaService]
})
export class PongModule {}
