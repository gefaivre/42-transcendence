import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelService.create(createChannelDto);
  }

  @Post(':id/users/:userId')
  addUserToChannel(@Param('id') id: string, @Param('userId') userId: string) {
    return this.channelService.addUserToChannel(+id, +userId);
}

  @Post(':id/admin/:userId')
  addAdminToChannel(@Param('id') id: string, @Param('userId') userId: string) {
    return this.channelService.addAdminToChannel(+id, +userId);
}

  @Delete(':id/users/:userId')
  removeUserFromChannel(@Param('id') id: string, @Param('userId') userId: string) {
    return this.channelService.removeUserFromChannel(+id, +userId);
}

  @Delete(':id/admin/:userId')
  removeAdminFromChannel(@Param('id') id: string, @Param('userId') userId: string) {
    return this.channelService.removeAdminFromChannel(+id, +userId);
}

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.remove(+id);
  }
}
