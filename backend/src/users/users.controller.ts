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
    console.log("Leaderboard");
    return this.usersService.getTopMmr();
  }
  
  // START CRUD
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log("Add User");
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    console.log("Get all users");
    return this.usersService.findAll();
  }
  
  @Get(':name')
  findOne(@Param('name') name: string) {
    console.log("get user by name");
    return this.usersService.findOne(name);
  }
  
  @Patch(':name')
  update(@Param('name') name: string, @Body() updateUserDto: UpdateUserDto) {
    console.log("Update user");
    return this.usersService.update(name, updateUserDto);
  }
  
  @Delete(':name')
  remove(@Param('name') name: string) {
    console.log("Delete by name");
    return this.usersService.remove(name);
  }
  
  // END CRUD
  

}
