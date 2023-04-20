import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios'
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from './constants';
import * as qrcode from 'qrcode';
import * as OTPAuth from "otpauth";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService
  ) {}

  private _totp: OTPAuth.TOTP = new OTPAuth.TOTP({
    issuer: 'ft-transcendence',
    label: undefined, // custom for each client
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromUTF8(process.env.OTP_SECRET as string) // should be custom for each client also ?
  })

  // TODO: rename and typedef argument
  login(user: any) {
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

  decode(jwt: string) {
    return this.jwtService.decode(jwt)
  }

  async enable2FA(userId: number) {

    // user-custom label
    this._totp.label = userId.toString()

    // get qrcode
    const qr = await qrcode.toDataURL(this._totp.toString())

    // update in db
    await this.userService.update2FA(userId, true)

    // send back qrcode
    return qr
  }

  disable2FA(userId: number) {
    return this.userService.update2FA(userId, false)
  }

  validate2FA(token: string, userId: string) {

    // user-custom label
    this._totp.label = userId.toString()

    // verify token
    const isValid = this._totp?.validate({ token })

    // success only if isValid equal zero
    return isValid === 0
  }

}

