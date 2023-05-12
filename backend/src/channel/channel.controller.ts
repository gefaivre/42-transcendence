import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, NotFoundException, ValidationPipe, ConflictException, UnprocessableEntityException, ParseIntPipe, UnauthorizedException, BadRequestException, Logger, UseFilters, UseGuards, Req } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './../users/users.service';
import { ChannelDto } from './dto/channel.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ChannelExceptionsFilter } from './channel.filter';
import { UserByIdPipe } from './pipes/user-by-id.pipe';
import { UpdateChannelMemberDto } from './dto/update-member.dto';
import { ChannelByNamePipe } from './pipes/channel-by-name.pipe';

@Controller('channel')
@UseFilters(ChannelExceptionsFilter)
@UseGuards(AuthGuard('jwt'))
export class ChannelController {

  private readonly logger: Logger = new Logger(ChannelController.name, { timestamp: true })

  constructor(
    private readonly channelService: ChannelService, @Inject(UsersService)
    private readonly usersService: UsersService
  ) {}

  @Post()
  async create(@Req() request: any, @Body() channelDto: ChannelDto) {

    // we could also hash into the channel service
    if (channelDto.status === 'Protected') {
      try {
        channelDto.password = await bcrypt.hash(channelDto.password, 2) // bigger salt would take too long
      } catch (e) {
        throw new UnprocessableEntityException('Error about the channel password encryption.')
      }
    }

    const channel: CreateChannelDto = {
      channelName: channelDto.channelName,
      ownerId: request.user.id,
      status: channelDto.status,
      password: channelDto.password
    }

    try {
      await this.channelService.create(channel)
    } catch(e) {
      throw new ConflictException('channel already exist')
    }
  }

  @Delete(':channelName/:userId')
  async removeUser(@Req() request: any, @Param('userId', UserByIdPipe) user: any, @Param('channelName', ChannelByNamePipe) channel: any) {

    // banned user has to be member of the channel
    const isMember = channel.users.some((_user: any) => _user.id === user.id)
    if (isMember === false)
      throw new BadRequestException('user not member of channel')

    // only admins can ban
    const isAdmin = channel.admins.some((admin: any) => admin.id === request.user.id)
    if (isAdmin === false)
      throw new BadRequestException('user not admin of channel')

    // owner cannot be banned
    const isOwner = user.id === channel.ownerId
    if (isOwner === true)
      throw new BadRequestException('user is owner of the channel')

    // This try/catch because the built-in exception layer returns '500 Internal Error' on any prisma exception.
    // And we want to avoid 500! After those previous checks it should be good, but none of the above logic is atomic.
    // Between those 'verification steps' channel could have been deleted, user could have been deleted too, etc.
    // None of the above pipes act as unconditionnal guarantees.
    try {
      await this.channelService.removeUser(channel.name, user.id)
      this.logger.log(`user ${request.user.id} banned user ${user.id} from channel ${channel.name}`)
      return `user ${request.user.id} banned user ${user.id} from channel ${channel.name}`
    } catch(e) {
      throw new UnauthorizedException(`cannot remove user ${user.id} from channel ${channel.name} (internal error)`)
    }
  }

  @Patch(':channelNname/promote/:userId')
  async promoteAdmin(@Req() request: any, @Param('userId', UserByIdPipe) user: any, @Param('channelName', ChannelByNamePipe) channel: any) {

    // promoted user has to be member of the channel
    const isMember = channel.users.some((_user: any) => _user.id === user.id)
    if (isMember === false)
      throw new BadRequestException('user not member of channel')

    // admins cannot be promoted twice
    const isAdmin = channel.admins.some((admin: any) => admin.id === user.id)
    if (isAdmin === true)
      throw new BadRequestException('user not admin of channel')

    // only owner can promote to admin
    const isOwner = request.user.id === channel.ownerId
    if (isOwner === false)
      throw new UnauthorizedException('need to be the channel owner')

    try {
      await this.channelService.promoteAdmin(channel.name, user.id)
      this.logger.log(`user ${request.user.id} has promoted user ${user.id} admin of channel ${channel.name}`)
      return `user ${request.user.id} has promoted user ${user.id} admin of channel ${channel.name}`
    } catch(e) {
      throw new UnauthorizedException(`Cannot promote user ${user.id} admin of channel ${channel.name} (internal error)`)
    }
  }

 @Patch(':channelName/revoke/:userId')
  async revokeAdmin(@Req() request: any, @Param('userId', UserByIdPipe) user: any, @Param('channelName', ChannelByNamePipe) channel: any) {

    // revoked user has to be member of the channel
    const isMember = channel.users.some((_user: any) => _user.id === user.id)
    if (isMember === false)
      throw new BadRequestException('user not member of channel')

    // only admins can be revoked
    const isAdmin = channel.admins.some((admin: any) => admin.id === user.id)
    if (isAdmin === false)
      throw new BadRequestException('user not admin of channel')

    // only owner can revoke admins
    const isOwner = request.user.id === channel.ownerId
    if (isOwner === false)
      throw new UnauthorizedException('need to be the channel owner')

    try {
      await this.channelService.revokeAdmin(channel.name, user.id)
      this.logger.log(`user ${request.user.id} has revoked user ${user.id} as admin of channel ${channel.name}`)
      return `user ${request.user.id} has revoked user ${user.id} as admin of channel ${channel.name}`
    } catch(e) {
      throw new UnauthorizedException(`Cannot revoke user ${user.id} as admin of channel ${channel.name} (internal error)`)
    }
  }

  @Get()
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':name')
  async findOne(@Param('name', ChannelByNamePipe) channel: any) {
    return channel
  }

  @Delete(':name')
  async deleteOne(@Req() request: any, @Param('name', ChannelByNamePipe) channel: any) {

    if (request.user.id !== channel.ownerId)
      throw new UnauthorizedException('channel can only be delete by its owner')

    try {
      await this.channelService.deleteByName(channel.name)
    } catch(e) {
      throw new NotFoundException('channel not found')
    }
  }

  @Delete()
  deleteAll() {
    return this.channelService.deleteAll();
  }

}