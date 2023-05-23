import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DirectMessageService } from 'src/chat/dm.service';
import { UserByUsernamePipe } from './pipes/user-by-username.pipe';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {

  constructor(
    private readonly postsService: PostsService,
    private readonly dmService: DirectMessageService
  ) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }

  @Get('/channel/:id')
  findByChannel(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findByChannel(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dm/:username')
  getAllMesagesBetweenTwoUsers(@Req() request: any, @Param('username', UserByUsernamePipe) user: any) {
    return this.dmService.findAllMesagesBetweenTwoUsers(request.user.id, user.id)
  }

}
