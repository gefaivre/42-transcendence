import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, NotFoundException, ValidationPipe, ConflictException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from 'src/chat/dto/channel-dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { UpdateChannelDto } from './dto/update-channel.dto';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from './../users/users.service';
import { ChannelDto } from 'src/chat/dto/channel-dto';
import { User } from '@prisma/client';


@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService,
              @Inject(UsersService)
              private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createChannel(@Req() request: any, @Body(new ValidationPipe({ transform: true })) channelDto: ChannelDto) {
    const whoAmI = request.user;
    if (whoAmI) {
      const user: User | null = await this.usersService.findById(whoAmI?.id);
      if (user) {
        const channel: CreateChannelDto = {
          channelName: channelDto.channelName,
          ownerId: user.id,
          status: channelDto.status,
          password: channelDto.password
        }
        if (await this.channelService.create(channel) == null)
          throw new ConflictException('This channel already exists.')
      }
    }
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

  @Delete(':name')
  async delete(@Param('name') name: string) {
    try {
      const channel = await this.channelService.findByName(name)
      if (channel)
        return this.channelService.remove(channel.id);
    } catch (error) {
      throw new NotFoundException(`Channel ${name} doesn't exist`)
    }
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