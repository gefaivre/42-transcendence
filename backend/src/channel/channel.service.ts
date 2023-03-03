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

  findAll() {
    return `This action returns all channel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} channel`;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }
}
