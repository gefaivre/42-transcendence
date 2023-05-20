import { Injectable , Inject, HttpException, HttpStatus, forwardRef} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUsernameDto, UpdatePasswordDto } from './dto/update-user.dto';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ImagesService))
    private readonly images: ImagesService
  ) {}

  // START CRUD
  async create(createUserDto: CreateUserDto) {
    if (await this.findByUsername(createUserDto.username) != null)
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
    return this.prisma.exclude(user, ['password'])
  }

  async findAll() {
    return await this.prisma.user.findMany()
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        pendingFriends: {
          select: {
            id: true,
            username: true
          }
        },
        requestFriends: {
          select: {
            id: true,
            username: true
          }
        },
        friends: {
          select: {
            id: true,
            username: true
          }
        },
        friendOf: {
          select: {
            id: true,
            username: true
          }
        },
      }
    });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async findByFortyTwoLogin(login: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        ft_login: login
      }
    })
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async findByUsername(name: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: name,
      },
      include: {
        pendingFriends: {
          select: {
            id: true,
            username: true
          }
        },
        requestFriends: {
          select: {
            id: true,
            username: true
          }
        },
        friends: {
          select: {
            id: true,
            username: true
          }
        },
        friendOf: {
          select: {
            id: true,
            username: true
          }
        },
        channels: true,
        wins: true,
        loses:true

      }
    })
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async findOneById(userid: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +userid,
      }
    })
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async update(name: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { username: name },
      data: updateUserDto,
    });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async updateUsername(name: string, updateUsernameDto: UpdateUsernameDto) {
    const user = await this.prisma.user.update({
      where: { username: name },
      data: { username: updateUsernameDto.username }
    });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async updatePassword(name: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.update({
      where: { username: name },
      data: { password: updatePasswordDto.password }
    });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async remove(name: string) {
    const user = await this.prisma.user.delete({ where: { username: name } });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
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

  update2FA(id: number, twofa: boolean) {
    return this.prisma.user.update({
        where: {
            id: id
        },
        data: {
            TwoFA: twofa
        }
    })
  }

  async requestFriendship(id: number, friendId: number) {
    console.log('service request friendship')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        pendingFriends: {
          connect: { id: friendId }
        }
      }
    });
  }

  async cancelFriendshipRequestById(id: number, friendId: number) {
    console.log('service cancel friendship request by id')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        pendingFriends: {
          disconnect: [{ id: friendId }]
        }
      },
    });
  }

 async cancelFriendshipRequestByName(id: number, name: string) {
    console.log('service cancel friendship request by name')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        pendingFriends: {
          disconnect: [{ username: name }]
        }
      },
    });
  }

  async acceptFriendshipRequestById(id: number, friendId: number) {
    console.log('service accept friendship request by id')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        requestFriends: {
          disconnect: [{ id: friendId }]
        },
        friends: {
          connect: [{ id: friendId }]
        },
        friendOf: {
          connect: [{ id: friendId }]
        },
      },
    });
  }

  async acceptFriendshipRequestByName(id: number, name: string) {
    console.log('service accept friendship request by name  ',id, ' to ', name)
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        requestFriends: {
          disconnect: [{ username: name }]
        },
        friends: {
          connect: [{ username: name }]
        },
        friendOf: {
          connect: [{ username: name }]
        },
      },
    });
  }

  async dismissFriendshipRequestById(id: number, friendId: number) {
    console.log('service dismiss friendship request by id')
    return await this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        requestFriends: {
          disconnect: [{ id: friendId }]
        }
      },
    });
  }

  async dismissFriendshipRequestByName(id: number, name: string) {
    console.log('service dismiss friendship request by name')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        requestFriends: {
          disconnect: [{ username: name }]
        }
      },
    });
  }

  async removeFriendById(id: number, friendId: number) {
    console.log('service remove friend by id')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        friends: {
          disconnect: [{ id: friendId }]
        },
        friendOf: {
          disconnect: [{ id: friendId }]
        },
      },
    });
  }

  async removeFriendByName(id: number, name: string) {
    console.log('service remove friend by name')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        friends: {
          disconnect: [{ username: name }]
        },
        friendOf: {
          disconnect: [{ username: name }]
        },
      },
    });
  }

}
