import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ConflictException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUsernameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Request} from 'express';
import * as bcrypt from 'bcrypt';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  // START CRUD

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/id/:id')
  findOneById(@Param('id') id: number) {
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
  async updateUsername(@Param('name') name: string, @Body() body: any, @Req() req: Request) {

    // check that user is changing its own username
    if (this.authService.decode(req.cookies.jwt)?.sub != body.id)
      throw new UnauthorizedException('Unauthorized to change other player username.')

    // check that new username is not already used
    try {
      await this.usersService.updateUsername(name, { username: body.username } as UpdateUsernameDto);
    } catch (error) {
      throw new ConflictException('This username is already used.')
    }
  }

  // We might use guards someway to handle those verifications
  @Patch('password/:name')
  async updatePassword(@Param('name') name: string, @Body() body: any, @Req() req: Request) {

    // check that user is changing its own password
    if (this.authService.decode(req.cookies.jwt)?.sub != body.id)
      throw new UnauthorizedException('Unauthorized to change other player password.')

    let hash

    // hash password
    try {
      hash = await bcrypt.hash(body.password, 2) // bigger salt would take too long
    } catch (error) {
      throw new UnprocessableEntityException('Error about your password encryption')
    }

    // update password
    try {
      await this.usersService.updatePassword(name, { password: hash } as UpdatePasswordDto);
    } catch (error) {
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

  // END CRUD

  @Post('friendship/request/:id')
  requestFriendship(@Param('id') id: string, @Req() req: any) {
    console.log('controller request friendship')
    return this.usersService.requestFriendship(req.user.id, +id)
  }

  @Post('friendship/cancelById/:id')
  cancelFriendshipRequestById(@Param('id') id: string, @Req() req: any) {
    console.log('controller cancel friendship request by id')
    return this.usersService.cancelFriendshipRequestById(req.user.id, +id)
  }

  @Post('friendship/cancelByName/:name')
  cancelFriendshipRequestByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller cancel friendship request by name')
    return this.usersService.cancelFriendshipRequestByName(req.user.id, name)
  }

  @Post('friendship/acceptById/:id')
  acceptFriendshipRequestById(@Param('id') id: string, @Req() req: any) {
    console.log('controller accept friendship request by id')
    return this.usersService.acceptFriendshipRequestById(req.user.id, +id)
  }

  @Post('friendship/acceptByName/:name')
  acceptFriendshipRequestByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller accept friendship request by name')
    return this.usersService.acceptFriendshipRequestByName(req.user.id, name)
  }

  @Post('friendship/dismissById/:id')
  dismissFriendshipRequestById(@Param('id') id: string, @Req() req: any) {
    console.log('controller dismiss friendship request by id')
    return this.usersService.dismissFriendshipRequestById(req.user.id, +id)
  }

  @Post('friendship/dismissByName/:name')
  dismissFriendshipRequestByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller dismiss friendship request by name')
    return this.usersService.dismissFriendshipRequestByName(req.user.id, name)
  }

  @Post('friendship/removeById/:id')
  removeFriendById(@Param('id') id: string, @Req() req: any) {
    console.log('controller remove friend by id')
    return this.usersService.removeFriendById(req.user.id, +id)
  }

  @Post('friendship/removeByName/:name')
  removeFriendByName(@Param('name') name: string, @Req() req: any) {
    console.log('controller remove friend by name')
    return this.usersService.removeFriendByName(req.user.id, name)
  }

}
