import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs'

// https://cdn.intra.42.fr/users/db271b9343eac0fdebb3e9fb79b586cc/small_gefaivre.jpg

@UseGuards(AuthGuard('jwt'))
@Controller('images')
export class ImagesController {

  constructor(private readonly images: ImagesService) {}

  @Post('add')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (request, file, cb) => {
        if (request.user === undefined || request.user === null)
          return "You shall not pass";
        const directory  = `/app/images/${request.user}`
        if (fs.existsSync(directory) === false)
          fs.mkdirSync(directory);
        cb(null, directory);
      },
      filename: (request, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    })
  }))
  addImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
    return this.images.addImage(request.user.id, file);
  }

  @Get('set/:id')
  setImage(@Req() request: any, @Param('id', ParseIntPipe) imageId: number) {
    return this.images.setImage(request.user.id, imageId);
  }

  @Get('actual/:userId')
  getImage(@Param('userId', ParseIntPipe) userId: number) {
    return this.images.getImage(userId);
  }

  @Get('all')
  findUserAll(@Req() request: any) {
    return this.images.findAll(request.user.id);
  }

  @Get(':id')
  findUserOne(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
    return this.images.findOne(request.user.id, id);
  }

  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.images.remove(id);
  }
}
