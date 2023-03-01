import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { MatchsModule } from './matchs/matchs.module';

@Module({
  imports: [PrismaModule, UsersModule, MatchsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
