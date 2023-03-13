import { ImATeapotException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';


@Injectable()
export class ChannelService {
  constructor(private prisma: PrismaService){}

  async create(createChannelDto: CreateChannelDto) {
    return this.prisma.channel.create({
      data:{
        name: createChannelDto.name,
        users: {
          connect: [{ id: createChannelDto.ownerId }]
        },
        ownerId: createChannelDto.ownerId,
      },
    });
  }// verifier le ownerId avant pour que prisma ne cree pas un user, ou se servir de la methode connect

  async findAll() {
    return await this.prisma.channel.findMany({
      include: {
        users: true
      }
    });
    //return `This action returns all channel`;
  }

  async findOne(id: number)  {
    return this.prisma.channel.findUnique({
      where: {
        id: id,
      }
    });
    //return `This action returns a #${id} channel`;
  }

  async findByName(name: string) {
    return this.prisma.channel.findFirst({
      where: {
        name: name,
      }
    });
  }

  async findByUser(userId: number) {
    return this.prisma.channel.findMany({
      where: {
        users: {
          some: {
            id: userId,
          }
        }
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
  
  async remove(id: number) {
    return await this.prisma.channel.delete({
      where:
    {
      id: id
    }});
   // return `This action removes a #${id} channel`;
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
    /*
    const updatedChannel = await this.prisma.channel.update({
      where: { id: channelId },
      data: {
        users: {
          connect: { id: userId }
        }
      },
      include: { users: true }
    });
    */
    return user.username + "  has been disconect from " + channel.name;
    //return updatedChannel;
  }
  
}
