import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        let jwt = request?.cookies['jwt']
        return jwt ? jwt : null
      }])
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

