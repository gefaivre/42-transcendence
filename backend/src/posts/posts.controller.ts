import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DirectMessageService } from 'src/chat/dm.service';
import { UserByUsernamePipe } from 'src/pipes';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {

  constructor(
    private readonly posts: PostsService,
    private readonly dm: DirectMessageService
  ) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.posts.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.posts.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.posts.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.posts.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.posts.remove(id);
  }

  @Get('channel/:id')
  findByChannel(@Param('id', ParseIntPipe) id: number) {
    return this.posts.findByChannel(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dm/:username')
  getAllMesagesBetweenTwoUsers(@Req() request: any, @Param('username', UserByUsernamePipe) user: any) {
    return this.dm.findAllMesagesBetweenTwoUsers(request.user.id, user.id)
  }

}
