import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImagesModule } from 'src/images/images.module';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [forwardRef(() => ImagesModule)],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersGateway],
  exports: [UsersService]
})
export class UsersModule {}
