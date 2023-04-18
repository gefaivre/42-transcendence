import { Controller, Get, Query, Res, Req, UseGuards, Post, Body, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Request} from 'express';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // If you cycle through this loop, well, someone stole your login (Ò.Ó)
  private async generateUsername(login: string) {
    while (await this.usersService.findOne(login))
      login = login + '_'
    return login
  }

  @Get('42')
  async auth42(@Query('code') code: string, @Res() response: Response) {

    // exchange code for access token
    const access_token = await this.authService.getFortyTwoAccessToken(code);

    // TODO (?): throw http exception
    // code we sent could have been wrong
    if (access_token == null)
      return response.redirect('http://localhost:8080')

    // exchange access token for user data
    const ft_user = await this.authService.getFortyTwoUser(access_token);

    // see if this 42 user already in db
    let user
    user = await this.usersService.findByFortyTwoLogin(ft_user.login)

    // first conection: register in db
    if (!user) {

      let newUser: CreateUserDto = {
        username: await this.generateUsername(ft_user.login),
        password: '',
        ft_login: ft_user.login,
        image: new URL(ft_user.image.versions.small)
      }

      user = await this.usersService.create(newUser)

      // TODO
      if (user == null)
        return
    }

    // bind a jwt to the authenticated user
    const jwt = await this.authService.login(user)

    // return the jwt as a cookie into frontend
    response.cookie('jwt', jwt, { httpOnly: true })

    // redirect to frontend
    return response.redirect('http://localhost:8080')
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {

    let hash

    // hash password
    try {
      hash = await bcrypt.hash(body.password, 2) // bigger salt would take too long
    } catch (error) {
      throw new UnprocessableEntityException('Error about your password encryption')
    }

    // create user
    body.password = hash
    const user = await this.usersService.create(body)
    if (user == null)
      throw new ConflictException('This username already exists')

    // remove password field from user object
    const { password, ...result } = user;

    // frontend need to login after
    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request, @Res({ passthrough: true }) response: Response) {

    // bind a jwt to the authenticated user
    const jwt = await this.authService.login(req.user)

    // return the jwt as a cookie into frontend
    response.cookie('jwt', jwt, { httpOnly: true })
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('jwt', '', { expires: new Date(0) });
  }

  // TODO (?): move into users controller (would be a conflict with other get routes though)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() request: any) {
    return request.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('whoami')
  async getUser(@Req() request: any) { // Set to async for the console.log(user) (await)
    const whoami = request.user;
    let user = await  this.usersService.findById(whoami?.id)
    console.log(user);
    return user;
  }

}
