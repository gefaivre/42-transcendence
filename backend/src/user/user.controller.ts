import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user/')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':name')
  async getUserByName(@Param('id') id: string): Promise<User> {
    return this.userService.findUnique({ where: { id: Number(id) } })
  }


    @Post()
    addUser(
        @Body() data: Prisma.UserCreateInput
      ): Promise<User> {
        console.log("name =", data.username)
        console.log("password = ", data.password)
        return this.userService.addUser(data)
      }
}
