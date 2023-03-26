import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios'
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService
  ) {}

  // TODO (?): remove async
  async login(user: any) {
    const payload = { sub: user.id };
    return this.jwtService.sign(payload)
  }

  async getFortyTwoAccessToken(code: string) {
    try {
      const res = await axios.post('https://api.intra.42.fr/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.FT_UID,
          client_secret: process.env.FT_SECRET,
          code: code,
          redirect_uri: 'http://localhost:3000/auth/42'
        }
      })
      return res.data.access_token
    } catch (error) {
        console.log(error.response.data)
        return null
    }
  }

  async getFortyTwoUser(access_token: string) {
    const fortytwouser = await axios.get('https://api.intra.42.fr/v2/me', {
      headers : { Authorization: 'Bearer ' + access_token }
    })
    return fortytwouser.data;
  }

  async validateToken(token: string) {
    return this.jwtService.verify(token, {secret:  jwtConstants.secret, ignoreExpiration: true });
  }

  // TODO (?): Insert this function's body into LocalStrategy validate()
  async validateLocalUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      // TODO (?): select only id field
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

}

