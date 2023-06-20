import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChannelService } from 'src/channel/channel.service';
import { joinChannelDto } from './dto/joinChannel-dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly channel: ChannelService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async joinChannel(@Body() body: joinChannelDto, @Req() req: any) {
    await this.channel.addUserToChannel(body.channelName, req.user.id);
  }
}
