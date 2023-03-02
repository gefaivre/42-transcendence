import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // START CRUD
  
  async create(createUserDto: CreateUserDto) {
    await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
        games: 0,
        mmr: 100,
      },
    })
    let string: String
    string = 'New user add! :  ' + createUserDto.username;
    return string;
  }

  async findAll() {
    return await this.prisma.user.findMany({
    })
  }
  
  async findOne(name: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: name,
      }
    })
    return user;
  }
  
  async update(name: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return this.prisma.user.update({
      where: { username: name },
      data: updateUserDto,
    });
  }
  
  async remove(name: string) {
    return this.prisma.user.delete({ where: { username: name } });
  }

  // END CRUD

  async getTopMmr(){
    return await this.prisma.user.findMany({
      take: 10,
      orderBy: {
          mmr: 'asc',
      }
    })

}}
