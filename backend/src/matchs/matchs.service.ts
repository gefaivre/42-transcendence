import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchsService {

  constructor(private readonly prisma: PrismaService) {}

  async create(createMatchDto: CreateMatchDto) {
    return this.prisma.match.create({
      data: {
        winnerId: createMatchDto.winnerId,
        winnerScore: createMatchDto.winnerScore,
        loserId: createMatchDto.loserId,
        loserScore: createMatchDto.loserScore,
        ranked: createMatchDto.ranked,
      },
    })
  }

  async findAll() {
    return await this.prisma.match.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.match.findUnique({
      where: {
        id: id,
      }
    });
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    return this.prisma.match.update({
      where: { id: id },
      data: {
        winnerId: updateMatchDto.winnerId,
        winnerScore: updateMatchDto.winnerScore,
        loserId: updateMatchDto.loserId,
        loserScore: updateMatchDto.loserScore,
        date: updateMatchDto.date,
        ranked: updateMatchDto.ranked,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.match.delete({ where: { id: id }});
  }

  async findHistory(userId: number) {
    return await this.prisma.match.findMany({
      where: {
        OR: [
          { winnerId: userId },
          { loserId: userId },
        ]
      },
      orderBy: { date: 'desc' }
    })
  }

  async removeHistory(userId: number) {
    return this.prisma.match.deleteMany({
      where: {
        OR: [
          { winnerId: userId },
          { loserId: userId },
        ]
      },
    });
  }



}
