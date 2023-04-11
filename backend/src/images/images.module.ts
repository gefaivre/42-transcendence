import { Module, forwardRef } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [ImagesController],
  providers: [ImagesService, PrismaService],
  exports: [ImagesService]
})
export class ImagesModule {}
