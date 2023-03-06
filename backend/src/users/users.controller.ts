import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('leaderboard') // TODO: To put in other controller
  topMmr() {
    return this.usersService.getTopMmr();
  }
  
  // START CRUD
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.usersService.findOne(name);
  }
  
  @Patch(':name')
  update(@Param('name') name: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(name, updateUserDto);
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
