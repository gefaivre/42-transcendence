import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios'

@Injectable()
export class AuthService {
  constructor(
      private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // TODO error 500 if `code` isn't correct
  async getFortyTwoAccessToken(code: string) {
    const res = await axios.post('https://api.intra.42.fr/oauth/token', null, { params: {
      grant_type: 'authorization_code',
        client_id: process.env.UID,
        client_secret: process.env.SECRET,
        code: code,
        redirect_uri: 'http://localhost:3000/auth/42'
      }
    })
    return res.data.access_token;
  }

  async getFortyTwoUser(access_token: string) {
    const fortytwouser = await axios.get('https://api.intra.42.fr/v2/me', {
      headers : { Authorization: 'Bearer ' + access_token }
    })
    return fortytwouser.data;
  }

  async signin(username: string, password: string) {
    if (await this.usersService.findOne(username) == null) {
      this.usersService.create({ username: username, password: password })
    }
  }

}

