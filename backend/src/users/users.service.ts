import { Injectable , Inject, HttpException, HttpStatus, forwardRef} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ImagesService } from 'src/images/images.service';
import { UpdateUserDto, UpdateUserameDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,
    @Inject(forwardRef(() => ImagesService))
              private images: ImagesService) {}

  // START CRUD
  async create(createUserDto: CreateUserDto) {
    if (await this.findOne(createUserDto.username) != null)
      throw new HttpException('This username already exists', HttpStatus.CONFLICT)

      //Create User
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
          ft_login: createUserDto.ft_login,
          games:  Math.floor(Math.random() * (150 - 0) + 0),
          mmr: Math.floor(Math.random() * (1500 - 0) + 0),
        },
      })
    // Add image to user
    // create directory
    var fs = require('fs');
    var dir = `/images/${user.id}`;

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true })}

    // Add image link to the user
    let internlink;
    if (createUserDto.image != null)
    {
      //app/images/userId/image_name
      internlink = `/app/images/${user.id}` + createUserDto.username + "_default" + '.jpg'
      this.images.downloadImage(new URL(createUserDto.image),  internlink)
    }
    else
      internlink = "/app/images/basic_pp.jpg"

    console.log("link inage = ", internlink)

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
    console.log(name);
    console.log(updateUserDto);
    return this.prisma.user.update({
      where: { username: name },
      data: updateUserDto,
    });
  }

  updateUsername(name: string, updateUsernameDto: UpdateUserameDto) {
    return this.prisma.user.update({
      where: { username: name },
      data: { username: updateUsernameDto.username }
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
