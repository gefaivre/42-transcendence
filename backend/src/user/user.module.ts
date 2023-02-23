import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({})
export class UserModule {
    imports: [PrismaModule]
    controllers: [UserController]
    providers: [UserService]
}
