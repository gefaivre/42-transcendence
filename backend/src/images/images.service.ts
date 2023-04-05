import { Inject, Injectable, StreamableFile, forwardRef } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { UsersService } from 'src/users/users.service';
import { PathLike, promises as fs } from "fs";
import { createReadStream } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { take } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { log } from 'console';


@Injectable()
export class ImagesService {
  constructor(@Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private PrismaService: PrismaService) {}


  async AddImage(userId: number, file: Express.Multer.File)
  {
    console.log("file in add Image = ", file)
    console.log("userId in add image = ", userId)
    let image = await this.PrismaService.image.create({
      data: {
        name: file.filename,
        link: `${file.destination}/${file.filename}`,
        userId: userId
      }

    })
    console.log("image in add image = ", image)
    return "Image created"
  }

  async setImage(UserId: number, imageId:number) {
    console.log("in setImage")
    let result = await this.PrismaService.image.update({
      where: { id: +imageId },
      data: {lastuse: new Date()}
    })
    console.log("result = ", result);
    return "update OK";
  }

  async findAll(userId: number) {
    let images = await this.PrismaService.image.findMany({
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

  async getImage(userId: string) {
    let image;
    let user = await this.usersService.findById(+userId)
    if (user == null)
      return null;
    image = await this.PrismaService.image.findMany({
      // take: 1,
      where: {
        User: {
          id: +userId
        },
      },
      orderBy: {
        lastuse: 'desc',
    }
    })
    console.log(image);

    const file = createReadStream(image[0].link);
    return new StreamableFile(file);
  }

  async findOne(userId: number, Id: number) {
    let image
    image = await this.PrismaService.image.findUnique({
      where: {
        id: Id
      }
    })
    if (image == null)
      return null;
    else
    {
      const file = createReadStream(image.link);
      return new StreamableFile(file)
    }
  }

  AddOne(UserId: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${UserId} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
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
