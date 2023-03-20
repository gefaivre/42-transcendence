import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async loginFortyTwo(ft_login: string, ft_id: string) {
    const payload = { username: ft_login, sub: ft_id };
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

}

