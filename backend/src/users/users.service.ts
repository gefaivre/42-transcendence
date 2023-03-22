import { Injectable , Inject} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
              private images: ImagesService) {}


  // START CRUD

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto.username);
    if (await this.findOne(createUserDto.username) != null)
      return "User " + createUserDto.username + " already exist";
      // this.remove(createUserDto.username)

    // this.images.downloadImage(new URL(createUserDto.image),  '/app/images/' + createUserDto.username + '.jpg')

    await this.prisma.user.create({
      data: {
        username: "test",
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
