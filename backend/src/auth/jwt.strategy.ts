import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from "express";
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.jwt
      }])
    });
  }

  // TODO (?): typedef the payload
  async validate(payload: any) {

    const user = await this.userService.findById(payload.sub)

    if (user === null)
      throw new BadRequestException('User not found')

    const { password, ...result } = user

    return result
  }
}

