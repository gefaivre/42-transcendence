import { Injectable } from '@nestjs/common';
import { ImagesService } from 'src/images/images.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private images: ImagesService) {}

  // START CRUD

  async create(createUserDto: CreateUserDto) {
    if (await this.findOne(createUserDto.username) != null)
      this.remove(createUserDto.username)
      // return "User " + createUserDto.username + " already exist";

    this.images.downloadImage(new URL("https://cdn.intra.42.fr/users/db271b9343eac0fdebb3e9fb79b586cc/small_gefaivre.jpg"),  '/app/images/' + createUserDto.username + '.jpg')

    await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: createUserDto.password,
        games:  Math.floor(Math.random() * (150 - 0) + 0),
        mmr: Math.floor(Math.random() * (1500 - 0) + 0),
      },
    })
    return 'New user add! :  ' + createUserDto.username;
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
