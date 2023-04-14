import { Injectable , Inject, HttpException, HttpStatus, forwardRef} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUsernameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    @Inject(forwardRef(() => ImagesService))
              private images: ImagesService) {}

  // START CRUD
  async create(createUserDto: CreateUserDto) {
    if (await this.findOne(createUserDto.username) != null)
      return null

      // Create User
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
          ft_login: createUserDto.ft_login,
          games:  Math.floor(Math.random() * (150 - 0) + 0),
          mmr: Math.floor(Math.random() * (1500 - 0) + 0),
          images: {
            create: {
              name: "default",
              link: "/app/images/basic_pp.jpg",
            }
          },
        }
      })

    // Add image to user
    if (createUserDto.image != null)
    {
      let internlink;
      //create dir app/images/userId/image_name
      var fs = require('fs');
      var dir = `/app/images/${user.id}`
      if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
      internlink = `/app/images/${user.id}/` + "default42" + '.jpg'
      this.images.downloadImage(new URL(createUserDto.image),  internlink)
      await this.prisma.image.create({
        data: {
          name: "default42",
          link: internlink,
          userId: user.id,
        }
      })
    }
    return user
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
      }
      // include: {
      //   channels: true
      // }
    })
  }

  async findOneById(userid: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: +userid,
      }
    })
  }

  async update(name: string, updateUserDto: UpdateUserDto) {
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
