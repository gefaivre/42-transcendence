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
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: '/app/images',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
      }
    })
  }))
  AddImage(@Req() request: any, @UploadedFile() file: Express.Multer.File) {
    return this.imagesService.AddImage(request.user.id, file);
  }

  // @Post(':userId')
  // AddImage(@Param('userId') userId: number ,@Body() createImageDto: CreateImageDto) {
  //   return this.imagesService.AddImage(userId, createImageDto);
  // }

  @Get(':userId')
  getImage(@Param('userId') userId: string) {
    return this.imagesService.getImage(userId);
  }

  @Get(':userId/all')
  findUserAll(@Param('userId') userId: string) {
    return this.imagesService.findAll();
  }

  @Get(':userId/:Id')
  findUserOne(@Param('userId') userId: string, @Param('Id') Id: string) {
    return this.imagesService.findOne(+userId, +Id);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
