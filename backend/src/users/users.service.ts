import { Injectable, Inject, forwardRef} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ImagesService } from 'src/images/images.service';
import * as fs from 'fs'

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ImagesService))
    private readonly images: ImagesService
  ) {}

  async create(createUserDto: CreateUserDto) {

    if (await this.findByUsername(createUserDto.username) !== null)
      return null

      // Create User
      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
          ft_login: createUserDto.ft_login,
          games:  0,
          mmr: 800,
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
      const dir = `/app/images/${user.id}`
      if (fs.existsSync(dir) === false)
        fs.mkdirSync(dir);
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

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
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

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      }
    })
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { username: username },
      data: updateUserDto,
    });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async updateUsername(username: string, newName: string) {
    const user = await this.prisma.user.update({
      where: { username: username },
      data: { username: newName }
    });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async updatePassword(username: string, newPassword: string) {
    const user = await this.prisma.user.update({
      where: { username: username },
      data: { password: newPassword }
    });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async remove(username: string) {
    const user = await this.prisma.user.delete({ where: { username: username } });
    return user === null ? user : this.prisma.exclude<any,any>(user, ['password'])
  }

  async removeAllUsers() {
    return this.prisma.user.deleteMany();
  }

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

  async cancelFriendshipRequestByName(id: number, username: string) {
    console.log('service cancel friendship request by name')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        pendingFriends: {
          disconnect: [{ username: username }]
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

  async acceptFriendshipRequestByName(id: number, username: string) {
    console.log('service accept friendship request by name  ',id, ' to ', username)
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        requestFriends: {
          disconnect: [{ username: username }]
        },
        friends: {
          connect: [{ username: username }]
        },
        friendOf: {
          connect: [{ username: username }]
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

  async dismissFriendshipRequestByName(id: number, username: string) {
    console.log('service dismiss friendship request by name')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        requestFriends: {
          disconnect: [{ username: username }]
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

  async removeFriendByName(id: number, username: string) {
    console.log('service remove friend by name')
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        friends: {
          disconnect: [{ username: username }]
        },
        friendOf: {
          disconnect: [{ username: username }]
        },
      },
    });
  }

}
