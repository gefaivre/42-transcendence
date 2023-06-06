import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchsService {

  constructor(private readonly prisma: PrismaService) {}

  async create(match: CreateMatchDto) {
    return this.prisma.match.create({
      data: {
        winnerId: match.winnerId,
        winnerScore: match.winnerScore,
        loserId: match.loserId,
        loserScore: match.loserScore,
        ranked: match.ranked,
      },
    })
  }

  async findAll() {
    return this.prisma.match.findMany();
  }

  async findOne(id: number) {
    return this.prisma.match.findUnique({
      where: {
        id: id,
      }
    });
  }

  async update(id: number, match: UpdateMatchDto) {
    return this.prisma.match.update({
      where: { id: id },
      data: {
        winnerId: match.winnerId,
        winnerScore: match.winnerScore,
        loserId: match.loserId,
        loserScore: match.loserScore,
        date: match.date,
        ranked: match.ranked,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.match.delete({ where: { id: id }});
  }

  async findHistory(userId: number) {
    return this.prisma.match.findMany({
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
