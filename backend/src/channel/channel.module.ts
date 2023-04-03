import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ImagesService } from 'src/images/images.service';
import { UsersModule } from 'src/users/users.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [PrismaModule, UsersModule, ImagesModule],
  controllers: [ChannelController],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService]
})
export class ChannelModule {}
