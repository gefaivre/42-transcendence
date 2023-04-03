import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserameDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { Request} from 'express';

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
    return this.usersService.findOne(name);
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
      throw new UnauthorizedException()

    // check that new username is not already used
    try {
      await this.usersService.updateUsername(name, { username: body.username } as UpdateUserameDto);
    } catch (error) {
      throw new ConflictException()
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

}
