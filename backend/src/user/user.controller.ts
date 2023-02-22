import { Body, Controller, Get, Param, Post} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user/')
export class UserController {
    constructor(private readonly appService: UserService) {}

    @Get('/:name')
    getUsers(@Param('name') name: string): string {
        return name
    }


    // @Post()
    // addUser(
    //     @Body() userData: { name?: string; email: string },
    //   ): string {
    //     return this.UserService.addUser(userData);
    //   }
}
