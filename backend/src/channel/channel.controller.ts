import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { UpdateChannelDto } from './dto/update-channel.dto';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from './../users/users.service';


@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService,
              @Inject(UsersService)
              private readonly usersService: UsersService) {}

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

  @Delete()
  removeAll() {
    return this.channelService.removeAll();
  }

  @Get('me/myself/andI')
  @UseGuards(AuthGuard('jwt'))
  myResource(@Req() request: Request & { user?: CreateUserDto }) {
    // le middleware AuthGuard a vérifié le jeton JWT de la requête
    // vous pouvez maintenant accéder à l'utilisateur en utilisant request.user
    const whoami = request.user;
    if (whoami) {
     // return whoami.username;
      return this.usersService.findOne(whoami?.username);
   // const username = request.user?.username;
    //return username
  }
}

}