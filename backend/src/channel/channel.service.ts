import { ImATeapotException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';



@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService){}

  async create(createChannelDto: CreateChannelDto) {
    if (await this.findByName(createChannelDto.name))
      return "Channel " + createChannelDto.name + " already exist";
    await this.prisma.channel.create({
      data: {
        name: createChannelDto.name,
        ownerId: createChannelDto.ownerId,
        admins: { connect: [{ id: createChannelDto.ownerId }] },
        users: { connect: [{ id: createChannelDto.ownerId }] }
      }
    })
    return 'New channel add! :  ' + createChannelDto.name;
  }// verifier le ownerId avant pour que prisma ne cree pas un user, ou se servir de la methode connect

  async findAll() {
    return await this.prisma.channel.findMany({
      include: {
        owner: true,
        users: true,
        admins: true
      }
    });
  }

  async findOne(id: number)  {
    return this.prisma.channel.findUnique({
      where: {
        id: id
      },
      include: {
        owner: true,
        users: true,
        admins: true
      }
    });
  }

  async findByName(name: string) {
    return this.prisma.channel.findFirst({
      where: {
        name: name
      },
      include: {
        owner: true,
        users: true,
        admins: true
      }
    });
  }

  async update(id: number, updateChannelDto: UpdateChannelDto) {
    return await this.prisma.channel.update({
      where: {id: id},
      data: {
        name: updateChannelDto.name,
        ownerId: updateChannelDto.ownerId,
      },
    });
    //return `This action updates a #${id} channel`;
  }

  async addUserToChannel(channelId: number, userId: number) {//utiliser les anciennes plutot
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId }
    }); //const channel = this.findOne(channelId)

    if (!channel) {
      //throw new NotFoundException(`Channel with ID ${channelId} not found`);
      return "wrong channel";
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return "wrong user";
      //throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        users: {
          connect: { id: userId }
        }
      },
      include: { users: true }
    });

    return updatedChannel;
  }

  async addAdminToChannel(channelId: number, userId: number) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId }
    }); //const channel = this.findOne(channelId)

    if (!channel) {
      //throw new NotFoundException(`Channel with ID ${channelId} not found`);
      return "wrong channel";
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return "wrong user";
      //throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        admins: {
          connect: { id: userId }
        }
      },
      include: {  users: true,
                  admins: true
      }
    });

    return updatedChannel;
  }

  async removeAdminFromChannel(channelId: number, userId: number) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId }
    }); //const channel = this.findOne(channelId)

    if (!channel) {
      //throw new NotFoundException(`Channel with ID ${channelId} not found`);
      return "wrong channel";
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return "wrong user";
      //throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        admins: {
          disconnect: { id: userId }
        }
      },
      include: {  users: true,
                  admins: true
      }
    });
    return updatedChannel;
  }
  
  async remove(id: number) {
    return await this.prisma.channel.delete({
      where:
    {
      id: id
    }});
   // return `This action removes a #${id} channel`;
  }

  async removeAll() {
    return await this.prisma.channel.deleteMany();
  }

  async removeUserFromChannel(channelId: number, userId: number) {//utiliser les anciennes plutot
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId }
    }); //const channel = this.findOne(channelId)

    if (!channel) {
      //throw new NotFoundException(`Channel with ID ${channelId} not found`);
      return "wrong channel";
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return "wrong user";
      //throw new NotFoundException(`User with ID ${userId} not found`);
    }
    

    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        users: {
          disconnect: { id: userId }
        }
      },
      include: { users: true }
    });
    return updatedChannel;
    //return user.username + "  has been disconect from " + channel.name;
    //return updatedChannel;
  }

  async safeRemoveUserFromChannel(channelId: number, userId: number, requestingUserId: number): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
      include: { users: true, admins: true},
    });
    if (!channel) {
      throw new NotFoundException(`Channel with id ${channelId} not found`);
    }

    // Vérifier que l'utilisateur qui demande la suppression est l'administrateur du canal
    const isAdmin = channel.admins.some((admin: any) => admin.id === requestingUserId);

    // Vérifier que l'utilisateur à retirer est soit l'utilisateur qui fait la demande,
    // soit un administrateur du canal
    const isSelfRemove = userId === requestingUserId;
    const isChannelUser = channel.users.some((user: any) => user.id === userId);
    if (!isSelfRemove && !isAdmin) {
      throw new UnauthorizedException('Only channel admins can remove users from the channel');
    } else if (!isSelfRemove && !isChannelUser) {
      throw new NotFoundException(`User with id ${userId} is not a member of channel with id ${channelId}`);
    }

    await this.prisma.channel.update({
      where: { id: channelId },
      data: { users: { disconnect: { id: userId } } },
    });
  }


}
