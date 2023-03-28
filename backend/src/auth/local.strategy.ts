import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // TODO: create typedef like UserLoginDto
  // TODO: encrypt password
  // TODO (?): distinguish user doesn't exist and wrong password
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateLocalUser(username, password);
    if (!user) {
      throw new ForbiddenException();
      //throw new HttpException('Wrong username or password', HttpStatus.FORBIDDEN)
    }
    return user;
  }
}