import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ConflictException, UnprocessableEntityException, UnauthorizedException, BadRequestException, Logger, UseFilters, UseGuards, Req, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChannelDto } from './dto/channel.dto';
import * as bcrypt from 'bcrypt';
import { TranscendenceExceptionsFilter } from '../filters';
import { UserByIdPipe, ChannelByNamePipe } from 'src/pipes';
import { Prisma } from '@prisma/client';

@Controller('channel')
@UseGuards(AuthGuard('jwt'))
@UseFilters(TranscendenceExceptionsFilter)
export class ChannelController {

  private readonly logger: Logger = new Logger(ChannelController.name, { timestamp: true })

  constructor(private readonly channel: ChannelService) {}

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
      await this.channel.create(channel)
    } catch(e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('channel already exist')
        } else if (e.code === 'P2003' || e.code === 'P2025') {
          throw new ForbiddenException('channel owner cannot be set')
        }
      } else {
        throw e
      }
    }
  }

  @Delete(':channelName/:userId')
  async removeUser(@Req() request: any, @Param('userId', UserByIdPipe) user: any, @Param('channelName', ChannelByNamePipe) channel: any) {

    // banned user has to be member of the channel
    const isMember: boolean = channel.users.some((_user: any) => _user.id === user.id)
    if (isMember === false)
      throw new BadRequestException('user not member of channel')

    // only admins can ban
    const isAdmin: boolean = channel.admins.some((admin: any) => admin.id === request.user.id)
    if (isAdmin === false)
      throw new BadRequestException('user not admin of channel')

    // owner cannot be banned
    const isOwner: boolean = user.id === channel.ownerId
    if (isOwner === true)
      throw new BadRequestException('user is owner of the channel')

    // This try/catch because the built-in exception layer returns '500 Internal Error' on any prisma exception.
    // And we want to avoid 500! After those previous checks it should be good, but none of the above logic is atomic.
    // Between those 'verification steps' channel could have been deleted, user could have been deleted too, etc.
    // None of the above pipes act as unconditionnal guarantees.
    try {
      await this.channel.removeUser(channel.name, user.id)
      this.logger.log(`user ${request.user.id} banned user ${user.id} from channel ${channel.name}`)
      return `user ${request.user.id} banned user ${user.id} from channel ${channel.name}`
    } catch(e) {
      throw new UnauthorizedException(`cannot remove user ${user.id} from channel ${channel.name} (internal error)`)
    }
  }

  @Patch(':channelNname/promote/:userId')
  async promoteAdmin(@Req() request: any, @Param('userId', UserByIdPipe) user: any, @Param('channelName', ChannelByNamePipe) channel: any) {

    // promoted user has to be member of the channel
    const isMember: boolean = channel.users.some((_user: any) => _user.id === user.id)
    if (isMember === false)
      throw new BadRequestException('user not member of channel')

    // admins cannot be promoted twice
    const isAdmin: boolean = channel.admins.some((admin: any) => admin.id === user.id)
    if (isAdmin === true)
      throw new BadRequestException('user not admin of channel')

    // only owner can promote to admin
    const isOwner: boolean = request.user.id === channel.ownerId
    if (isOwner === false)
      throw new UnauthorizedException('need to be the channel owner')

    try {
      await this.channel.promoteAdmin(channel.name, user.id)
      this.logger.log(`user ${request.user.id} has promoted user ${user.id} admin of channel ${channel.name}`)
      return `user ${request.user.id} has promoted user ${user.id} admin of channel ${channel.name}`
    } catch(e) {
      throw new UnauthorizedException(`Cannot promote user ${user.id} admin of channel ${channel.name} (internal error)`)
    }
  }

 @Patch(':channelName/revoke/:userId')
  async revokeAdmin(@Req() request: any, @Param('userId', UserByIdPipe) user: any, @Param('channelName', ChannelByNamePipe) channel: any) {

    // revoked user has to be member of the channel
    const isMember: boolean = channel.users.some((_user: any) => _user.id === user.id)
    if (isMember === false)
      throw new BadRequestException('user not member of channel')

    // only admins can be revoked
    const isAdmin: boolean = channel.admins.some((admin: any) => admin.id === user.id)
    if (isAdmin === false)
      throw new BadRequestException('user not admin of channel')

    // only owner can revoke admins
    const isOwner: boolean = request.user.id === channel.ownerId
    if (isOwner === false)
      throw new UnauthorizedException('need to be the channel owner')

    try {
      await this.channel.revokeAdmin(channel.name, user.id)
      this.logger.log(`user ${request.user.id} has revoked user ${user.id} as admin of channel ${channel.name}`)
      return `user ${request.user.id} has revoked user ${user.id} as admin of channel ${channel.name}`
    } catch(e) {
      throw new UnauthorizedException(`Cannot revoke user ${user.id} as admin of channel ${channel.name} (internal error)`)
    }
  }

  @Get()
  findAll() {
    return this.channel.findAll();
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
      await this.channel.deleteByName(channel.name)
    } catch(e) {
      throw new NotFoundException('channel not found')
    }
  }

  @Delete()
  deleteAll() {
    return this.channel.deleteAll();
  }

}