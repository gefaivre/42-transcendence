import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

// https://cdn.intra.42.fr/users/db271b9343eac0fdebb3e9fb79b586cc/small_gefaivre.jpg

@UseGuards(AuthGuard('jwt'))
@Controller('images')
export class ImagesController {

  constructor(private readonly imagesService: ImagesService) {}

  @Post('/add')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (request, file, cb) => {
        if (request.user == undefined)
          return "You shall not pass";
        var fs = require('fs');
        const directory  = `/app/images/${request.user}`
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory);
        }
        cb(null, directory);
      },
      filename: (request, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      }
    })
  }))

  AddImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
    return this.imagesService.AddImage(request.user.id, file);
  }

  @Get('/set/:Id')
  setImage(@Req() request: any, @Param('Id', ParseIntPipe) ImageId: number) {
    return this.imagesService.setImage(request.user.id, ImageId);
  }

  @Get('/actual/:userId')
  getImage(@Param('userId') userId: string) {
    return this.imagesService.getImage(userId);
  }

  @Get('/all')
  findUserAll(@Req() request: any) {
    return this.imagesService.findAll(request.user.id);
  }

  @Get(':Id')
  findUserOne(@Req() request: any, @Param('Id', ParseIntPipe) Id: number) {
    return this.imagesService.findOne(request.user.id, Id);
  }

  @Delete('/delete/:id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.imagesService.remove(id);
  }
}
