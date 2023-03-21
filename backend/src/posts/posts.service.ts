import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        content: createPostDto.content,
        authorId: createPostDto.authorId,
        channelId: createPostDto.channelId
      }
    });
  }

  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: {
        id: id,
      }
    });
  }

  async findByChannel(channelId: number) {
    return await this.prisma.post.findMany({
      where : {
        channelId: channelId
      }
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: {
        id: id,
      },
      data: {
        content: updatePostDto.content,
      }
    });
  }

  async remove(id: number) {
    return this.prisma.post.delete({ where: { id: id }});
  }
}
