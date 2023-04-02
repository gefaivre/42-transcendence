import { Controller, Post, Body } from '@nestjs/common';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';
import { ChannelDto } from './dto/channel-dto';

@Controller('chat')
export class ChatController {

  constructor(private readonly chatService: ChatService,
              private readonly usersService: UsersService
             ){}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createChannel(@Req() request: any, @Body() channelDto: ChannelDto) {
    const whoAmI = request.user;
    if (whoAmI) {
      const user: User | null = await this.usersService.findById(whoAmI?.id);
      if (user) {
        await this.chatService.createChannel(user.username, channelDto.channelName);
      }
    }
  }

}
