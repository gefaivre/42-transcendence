import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as fs from 'fs'

@Injectable()
export class UsersService {

  constructor(private readonly prisma: PrismaService) {}

  async create(user: CreateUserDto) {

    // create user
    const _user: User = await this.prisma.user.create({
      data: {
        username: user.username,
        password: user.password,
        ft_login: user.ft_login,
        games:  0,
        mmr: 800,
      }
    })

    // each user with its own image directory
    fs.mkdirSync(`/app/images/${_user.username}`)

    // user created via 42 API: there is an image
    if (user.image !== null && user.image !== undefined) {

      // path for the the image
      const path: string = `/app/images/${_user.username}/default42.jpg`

      // download the image into the docker volume
      const response = await fetch(user.image.href)
      const blob = await response.blob()
      const arrayBuffer = await blob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      fs.writeFileSync(path, buffer, { flag: 'wx' }) // are those flags the right ones ?

      // add image link to db
      await this.prisma.image.create({
        data: {
          path: path,
          userId: _user.id,
        }
      })
    }
    return this.prisma.exclude(_user, ['password'])
  }

  async findAll() {
    return this.prisma.user.findMany()
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
        blocked: {
          select: {
            id: true,
            username: true
          }
        },
        blockedBy: {
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
        blocked: {
          select: {
            id: true,
            username: true
          }
        },
        blockedBy: {
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

  async updateGameStats(username: string, games: number, mmr: number) {
    const user = await this.prisma.user.update({
      where: { username: username },
      data: { games: games, mmr: mmr },
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
      include: {
        friends: {
          select: {
            id: true,
            username: true,
          }
        }
      }
    });
  }

  async dismissFriendshipRequestById(id: number, friendId: number) {
    console.log('service dismiss friendship request by id')
    return this.prisma.user.update({
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

  async blockByUsername(id: number, username: string) {
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        blocked: {
          connect: [{ username: username }]
        }
      }
    })
  }

  async unblockByUsername(id: number, username: string) {
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        blocked: {
          disconnect: [{ username: username }]
        }
      }
    })
  }

  async isBlocked(id: number, username: string) {
    const blocked = await this.prisma.user.findFirst({
      where: {
        id: id
      },
      select: {
        blocked: {
          select: {
            username: true
          }
        }
      }
    })
    const usernames: string[] = blocked!.blocked.map((blocked: any) => blocked.username)
    return usernames.some((_username: string) => _username === username)
  }

  async isBlockedBy(id: number, username: string) {
    const blockedBy = await this.prisma.user.findFirst({
      where: {
        id: id
      },
      select: {
        blockedBy: {
          select: {
            username: true
          }
        }
      }
    })
    const usernames: string[] = blockedBy!.blockedBy.map((blocked: any) => blocked.username)
    return usernames.some((_username: string) => _username === username)
  }

}
