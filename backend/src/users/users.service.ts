import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUsernameDto, UpdatePasswordDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // START CRUD

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
          ft_login: createUserDto.ft_login,
          games:  Math.floor(Math.random() * (150 - 0) + 0),
          mmr: Math.floor(Math.random() * (1500 - 0) + 0),
        },
      })
      return user
    } catch (error) {
      return null
    }
  }

  async findAll() {
    return await this.prisma.user.findMany()
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findByFortyTwoLogin(login: string) {
    return await this.prisma.user.findUnique({
      where: {
        ft_login: login
      }
    })

  }

  async findOne(name: string) {
    return await this.prisma.user.findUnique({
      where: {
        username: name,
      },
      include: {
        channels: true
      }
    })
  }

  async update(name: string, updateUserDto: UpdateUserDto) {
    console.log(name);
    console.log(updateUserDto);
    return this.prisma.user.update({
      where: { username: name },
      data: updateUserDto,
    });
  }

  updateUsername(name: string, updateUsernameDto: UpdateUsernameDto) {
    return this.prisma.user.update({
      where: { username: name },
      data: { username: updateUsernameDto.username }
    });
  }

  updatePassword(name: string, updatePasswordDto: UpdatePasswordDto) {
    return this.prisma.user.update({
      where: { username: name },
      data: { password: updatePasswordDto.password }
    });
  }

  async remove(name: string) {
    return this.prisma.user.delete({ where: { username: name } });
  }

  async removeAllUsers() {
    return this.prisma.user.deleteMany();
  }

  // END CRUD

  async getTopMmr(){
    return await this.prisma.user.findMany({
      take: 10,
      orderBy: {
          mmr: 'desc',
      }
    })
  }

}
