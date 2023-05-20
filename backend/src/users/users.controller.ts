import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ConflictException, UnauthorizedException, UnprocessableEntityException, ParseIntPipe } from '@nestjs/common';
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

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.usersService.findByUsername(name);
  }

  @Patch(':name')
  update(@Param('name') name: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(name, updateUserDto);
  }

  // We might use guards someway to handle those verifications
  @Patch('username/:name')
  async updateUsername(@Param('name') name: string, @Body() body: UpdateUsernameDto, @Req() req: any) {

    // check that user updates its own username
    if (req.user.username !== body.username)
      throw new UnauthorizedException('Unauthorized to update other player username')

    // check that new username is not already used
    try {
      await this.usersService.updateUsername(username, body.username);
    } catch (e) {
      throw new ConflictException('This username is already used')
    }
  }

  // We might use guards someway to handle those verifications
  @Patch('password/:name')
  async updatePassword(@Param('name') name: string, @Body() body: UpdatePasswordDto, @Req() req: any) {

    // check that user updates its own password
    if (req.user.username !== username)
      throw new UnauthorizedException('Unauthorized to update other player password')

    let hash

    // hash password
    try {
      hash = await bcrypt.hash(body.password, 2) // bigger salt would take too long
    } catch (e) {
      throw new UnprocessableEntityException('Error about your password encryption')
    }

    // update password
    try {
      await this.usersService.updatePassword(username, hash);
    } catch (e) {
      throw new ConflictException('Error while updating your password')
    }
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.usersService.remove(name);
  }

  @Delete()
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

  @Post('friendship/cancelByName/:name')
  cancelFriendshipRequestByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller cancel friendship request by name')
    return this.usersService.cancelFriendshipRequestByName(req.user.id, name)
  }

  @Post('friendship/acceptById/:id')
  acceptFriendshipRequestById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller accept friendship request by id')
    return this.usersService.acceptFriendshipRequestById(req.user.id, id)
  }

  @Post('friendship/acceptByName/:name')
  acceptFriendshipRequestByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller accept friendship request by name(', req.user.id, 'accept', name, ')')
    return this.usersService.acceptFriendshipRequestByName(req.user.id, name)
  }

  @Post('friendship/dismissById/:id')
  dismissFriendshipRequestById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller dismiss friendship request by id')
    return this.usersService.dismissFriendshipRequestById(req.user.id, id)
  }

  @Post('friendship/dismissByName/:name')
  dismissFriendshipRequestByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller dismiss friendship request by name')
    return this.usersService.dismissFriendshipRequestByName(req.user.id, name)
  }

  @Post('friendship/removeById/:id')
  removeFriendById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    console.log('controller remove friend by id')
    return this.usersService.removeFriendById(req.user.id, id)
  }

  @Post('friendship/removeByName/:name')
  removeFriendByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller remove friend by name')
    return this.usersService.removeFriendByName(req.user.id, name)
  }

}
