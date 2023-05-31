import { Controller, Get, Post, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards, ParseIntPipe, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs'
import { FileSizeValidationPipe } from 'src/pipes';

@UseGuards(AuthGuard('jwt'))
@Controller('images')
export class ImagesController {

  constructor(private readonly images: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (request: any, file, cb) => {
        const directory  = `/app/images/${request.user.username}`
        if (fs.existsSync(directory) === false)
          fs.mkdirSync(directory);
        cb(null, directory);
      },
      filename: (request, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    })
  }))
  addImage(@Req() request: any, @UploadedFile(FileSizeValidationPipe) file: Express.Multer.File) {
    return this.images.addImage(request.user.id, file);
  }

  @Patch(':imageId')
  setImage(@Req() request: any, @Param('imageId', ParseIntPipe) imageId: number) {
    return this.images.setImage(request.user.id, imageId);
  }

  @Get('actual/:userId')
  getImage(@Param('userId', ParseIntPipe) userId: number) {
    return this.images.getImage(userId);
  }

  @Get()
  findUserAll(@Req() request: any) {
    return this.images.findAll(request.user.id);
  }

  @Get(':imageId')
  findUserOne(@Req() request: any, @Param('imageId', ParseIntPipe) imageId: number) {
    return this.images.findOne(request.user.id, imageId);
  }

  @Delete(':imageId')
  removeOne(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.images.remove(imageId);
  }
}
