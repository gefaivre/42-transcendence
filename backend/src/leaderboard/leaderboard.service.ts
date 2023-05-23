import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaderboardService {

    constructor(private readonly prisma: PrismaService) {}

    async getTopMmr(){
        return await this.prisma.user.findMany({
            take: 10,
            orderBy: {
                mmr: 'desc',
            }
        })
    }

    async getTopGames(){
        return await this.prisma.user.findMany({
            take: 10,
            orderBy: {
                games: 'desc',
            }
        })
    }

}
