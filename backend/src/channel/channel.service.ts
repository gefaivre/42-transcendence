import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {

  constructor(private readonly prisma: PrismaService){}

  create(createChannelDto: CreateChannelDto) {
    return this.prisma.channel.create({
      data: {
        name: createChannelDto.channelName, // P2002
        ownerId: createChannelDto.ownerId, // P2003
        admins: { connect: { id: createChannelDto.ownerId } }, // P2025
        users: { connect: { id: createChannelDto.ownerId } }, // P2025
        status: createChannelDto.status, // checked by ValidationPipe
        password: createChannelDto.password // ??
      }
    })
  }

  findAll() {
    return this.prisma.channel.findMany({
      include: {
        owner: true,
        users: true,
        admins: true,
        posts: true
      }
    });
  }

  findById(channelId: number)  {
    return this.prisma.channel.findUnique({
      where: {
        id: channelId
      },
      include: {
        owner: true,
        users: true,
        admins: true,
        posts: true
      }
    });
  }

  findByName(channelName: string) {
    return this.prisma.channel.findFirst({
      where: {
        name: channelName
      },
      include: {
        owner: true,
        users: true,
        admins: true,
        posts: true
      }
    });
  }

  deleteByName(channelName: string) {
    return this.prisma.channel.delete({
      where: {
        name: channelName
      }
    })
  }

  deleteAll() {
    return this.prisma.channel.deleteMany();
  }

  async isInChannel(channelName: string, userId: number): Promise<boolean> {
    const channel = await this.findByName(channelName)
    return channel !== null && channel.users.some(user => user.id === userId)
  }

  async isOwner(channelName: string, userId: number): Promise<boolean> {
    const channel = await this.findByName(channelName)
    return channel !== null && channel.owner.id === userId
  }

  async isAdmin(channelName: string, userId: number): Promise<boolean> {
    const channel = await this.findByName(channelName)
    return channel !== null && channel.admins.some(admin => admin.id === userId)
  }

  addUserToChannel(channelName: string, userId: number) {
    return this.prisma.channel.update({
      where: {
        name: channelName
      },
      data: {
        users: {
          connect: {
            id: userId
          }
        }
      }
    })
  }

  async leave(channelName: string, userId: number) {

    const channel = await this.findByName(channelName)

    // if the last member leave, we delete the channel
    if (channel?.users?.length === 1)
      return this.deleteByName(channelName)

    // if the owner leave, we transfer ownership
    if (channel?.ownerId === userId) {

      // prioritize admins to be the new owner
      let newOwner = channel.admins.find(admin => admin.id !== userId)

      if (newOwner === undefined)
        newOwner = channel.users.find(user => user.id !== userId)

      // promote new owner as admin if not already
      if (channel.admins.some(admin => admin.id === newOwner?.id) === true)
        this.promoteAdmin(channelName, newOwner?.id as number)

      // set new owner
      try {
        await this.prisma.channel.update({
          where: {
            name: channelName
          },
          data: {
            ownerId: newOwner?.id
          }
        })
      } catch(e) {
        throw new NotFoundException('channel not found')
      }

    }

    // now you can leave
    return this.removeUser(channelName, userId)
  }

  removeUser(channelName: string, userId: number) {
    return this.prisma.channel.update({
      where: {
        name: channelName
      },
      data: {
        users: {
          disconnect: {
            id: userId
          }
        },
        admins: {
          disconnect: {
            id: userId
          }
        }
      }
    })
  }

  promoteAdmin(channelName: string, userId: number) {
    return this.prisma.channel.update({
      where: {
        name: channelName
      },
      data: {
        admins: {
          connect: {
            id: userId
          }
        }
      }
    })
  }

  revokeAdmin(channelName: string, userId: number) {
    return this.prisma.channel.update({
      where: {
        name: channelName
      },
      data: {
        admins: {
          disconnect: {
            id: userId
          }
        }
      }
    })
  }

}
