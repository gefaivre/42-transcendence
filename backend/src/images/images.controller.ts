import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, UseGuards } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';


// https://cdn.intra.42.fr/users/db271b9343eac0fdebb3e9fb79b586cc/small_gefaivre.jpg

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Post('/add')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (request, file, cb) => {
        if (request.user == undefined)
          return "You shall not pass";
        const directory = `/app/images/${request.user}`
        cb(null, directory);
      },
      filename: (request, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  AddImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
    return this.imagesService.AddImage(request.user.id, file);
  }

  @Get('/set/:Id')
  @UseGuards(AuthGuard('jwt'))
  setImage(@Req() request: any, @Param('Id') ImageId: number) {
    return this.imagesService.setImage(request.user.id, ImageId);
  }

  @Get('/actual/:userId')
  @UseGuards(AuthGuard('jwt'))
  getImage(@Param('userId') userId: string) {
    return this.imagesService.getImage(userId);
  }

  @Get('/all')
  @UseGuards(AuthGuard('jwt'))
  findUserAll(@Req() request: any) {
    return this.imagesService.findAll(request.user.id);
  }

  @Get(':Id')
  @UseGuards(AuthGuard('jwt'))
  findUserOne(@Req() request: any, @Param('Id') Id: string) {
    return this.imagesService.findOne(request.user.id, +Id);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  removeOne(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
