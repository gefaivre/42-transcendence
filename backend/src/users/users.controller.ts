import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ConflictException, UnauthorizedException, UnprocessableEntityException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUsernameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/id/:id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Patch()
  update(@Body() body: UpdateUserDto, @Req() req: any) {
    return this.usersService.update(req.user.username, body);
  }

  @Patch('username')
  async updateUsername(@Body() body: UpdateUsernameDto, @Req() req: any) {

    try {
      await this.usersService.updateUsername(req.user.username, body.username);
    } catch (e) {
      throw new ConflictException('This username is already used')
    }
  }

  @Patch('password')
  async updatePassword(@Body() body: UpdatePasswordDto, @Req() req: any) {

    let hash
    try {
      hash = await bcrypt.hash(body.password, 2) // bigger salt would take too long
    } catch (e) {
      throw new UnprocessableEntityException('Error about your password encryption')
    }

    try {
      await this.usersService.updatePassword(req.user.username, hash);
    } catch (e) {
      throw new ConflictException('Error while updating your password')
    }
  }

  @Delete()
  async remove(@Req() req: any) {
    try {
      await this.usersService.remove(req.user.username)
    } catch(e) {
      throw new NotFoundException('User not found')
    }
  }

  // TODO: remove this endpoint
  @Delete('all')
  removeAllUsers() {
    return this.usersService.removeAllUsers();
  }

  @Post('friendship/request/:id')
  requestFriendship(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller request friendship')
    return this.usersService.requestFriendship(req.user.id, id)
  }

  @Post('friendship/cancelById/:id')
  cancelFriendshipRequestById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller cancel friendship request by id')
    return this.usersService.cancelFriendshipRequestById(req.user.id, id)
  }

  @Post('friendship/cancelByName/:username')
  cancelFriendshipRequestByName(@Param('username') username: string, @Req() req: any) {
    console.log('controller cancel friendship request by name')
    return this.usersService.cancelFriendshipRequestByName(req.user.id, username)
  }

  @Post('friendship/acceptById/:id')
  acceptFriendshipRequestById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller accept friendship request by id')
    return this.usersService.acceptFriendshipRequestById(req.user.id, id)
  }

  @Post('friendship/acceptByName/:username')
  acceptFriendshipRequestByName(@Param('username') username: string, @Req() req: any) {
    console.log('controller accept friendship request by name(', req.user.id, 'accept', username, ')')
    return this.usersService.acceptFriendshipRequestByName(req.user.id, username)
  }

  @Post('friendship/dismissById/:id')
  dismissFriendshipRequestById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller dismiss friendship request by id')
    return this.usersService.dismissFriendshipRequestById(req.user.id, id)
  }

  @Post('friendship/dismissByName/:username')
  dismissFriendshipRequestByName(@Param('username') username: string, @Req() req: any) {
    console.log('controller dismiss friendship request by name')
    return this.usersService.dismissFriendshipRequestByName(req.user.id, username)
  }

  @Post('friendship/removeById/:id')
  removeFriendById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller remove friend by id')
    return this.usersService.removeFriendById(req.user.id, id)
  }

  @Post('friendship/removeByName/:username')
  removeFriendByName(@Param('username') username: string, @Req() req: any) {
    console.log('controller remove friend by name')
    return this.usersService.removeFriendByName(req.user.id, username)
  }

}
