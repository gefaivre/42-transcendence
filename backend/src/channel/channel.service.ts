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
        ownerId: createChannelDto.ownerId,
      },
    });
  }// verifier le ownerId avant pour que prisma ne cree pas un user, ou se servir de la methode connect

  async findAll() {
    return await this.prisma.channel.findMany({});
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

  async remove(id: number) {
    return await this.prisma.channel.delete({
      where:
    {
      id: id
    }});
   // return `This action removes a #${id} channel`;
  }
}
