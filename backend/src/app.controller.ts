import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {

  constructor() {}

  // This endpoint exist only to test its guard policy
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  testJwt(@Request() req: any) {
    return req.user
  }

}

