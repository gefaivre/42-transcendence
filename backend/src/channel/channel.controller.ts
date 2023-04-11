import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, NotFoundException, ValidationPipe, ConflictException, UnprocessableEntityException, ConsoleLogger, ParseIntPipe, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';


@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService,
              @Inject(UsersService)
              private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() request: any, @Body(new ValidationPipe({ transform: true })) channelDto: ChannelDto) {

    const user: User | null = await this.usersService.findById(request.user.id);

    // is it really possible ??
    if (user == null)
      throw new BadRequestException("User cannot create a channel because he doesn't exist !...")

    // we could also hash into the channel service
    if (channelDto.status === 'Protected') {
      try {
        channelDto.password = await bcrypt.hash(channelDto.password, 2) // bigger salt would take too long
      } catch (error) {
        throw new UnprocessableEntityException('Error about the channel password encryption.')
      }
    }

    const channel: CreateChannelDto = {
      channelName: channelDto.channelName,
      ownerId: user.id,
      status: channelDto.status,
      password: channelDto.password
    }

    if (await this.channelService.create(channel) === null)
      throw new ConflictException('This channel already exists.')
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/users/:id')
  addUser(@Req() request: any, @Param('id', new ParseIntPipe) id: number) {
    return this.channelService.addUserToChannel(id, request.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/users/:id')
  removeUser(@Req() request: any, @Param('id', new ParseIntPipe) id: number) {
    return this.channelService.removeUserFromChannel(id, request.user.id);
  }

  @Post(':id/admin/:userId')
  addAdminToChannel(@Param('id') id: string, @Param('userId') userId: string) {
    return this.channelService.addAdminToChannel(+id, +userId);
  }

  @Delete(':id/admin/:userId')
  removeAdminFromChannel(@Param('id') id: string, @Param('userId') userId: string) {
    return this.channelService.removeAdminFromChannel(+id, +userId);
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.channelService.findByName(name);
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