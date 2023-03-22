import { Injectable, StreamableFile } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PathLike, promises as fs } from "fs";
import { createReadStream } from 'fs';
import { join } from 'path';


@Injectable()
export class ImagesService {
  create(createImageDto: CreateImageDto) {
    return 'This action adds a new image';
  }

  findAll() {
    return `This action returns all images`;
  }

  findOne(userId: number, Id: number) {

    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file)
    return `This action returns a #${userId} image`;
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
