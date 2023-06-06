import { Injectable, StreamableFile } from '@nestjs/common';
import { PathLike, promises as fs } from "fs";
import { createReadStream } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImagesService {

  constructor(private readonly PrismaService: PrismaService) {}

  async addImage(userId: number, file: Express.Multer.File)
  {
    const image = await this.PrismaService.image.create({
      data: {
        link: `${file.destination}/${file.filename}`,
        userId: userId
      }
    })
    return "Image created"
  }

  async setImage(userId: number, imageId: number) {
    const result = await this.PrismaService.image.update({
      where: { id: imageId },
      data: {lastuse: new Date()}
    })
    return "update OK";
  }

  async findAll(userId: number) {
    const images = await this.PrismaService.image.findMany({
      where: {
        User: {
          id: userId
        }
      },
      orderBy: {
        lastuse: 'desc',
      }
    })
    return images;
  }

  async getImage(userId: number) {
    const image = await this.PrismaService.image.findMany({
      take: 1,
      where: {
        User: {
          id: userId
        },
      },
      orderBy: {
        lastuse: 'desc',
      }
    })
    if (image[0] !== undefined) {
      const file = createReadStream(image[0].link);
      return new StreamableFile(file);
    }
  }

  async findOne(userId: number, id: number) {
    const image = await this.PrismaService.image.findUnique({
      where: {
        id: id
      }
    })
    if (image === null)
      return null;
    else
    {
      const file = createReadStream(image.link);
      return new StreamableFile(file)
    }
  }

  async remove(id: number) {
    return await this.PrismaService.image.delete({
      where: {
        id: id
      }
    })
  }

  async downloadImage(link: URL, path: PathLike) {

    const response = await fetch(link);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(path, buffer, {flag: 'wx'});
    return path;
  }

}
