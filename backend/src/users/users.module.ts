import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesModule } from 'src/images/images.module';
import { ImagesService } from 'src/images/images.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, ImagesModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, AuthService, JwtService, ImagesService],
  exports: [UsersService]
})
export class UsersModule {}
