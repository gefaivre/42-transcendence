import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super();
  }

  // TODO: typedef arguments with proper dto
  async validate(username: string, _password: string): Promise<any> {

    const user = await this.userService.findOne(username);

    if (!user)
      throw new BadRequestException("Username doesn't exist")

    // TODO: remove `as string`
    if (!await bcrypt.compare(_password, user.password as string))
      throw new ForbiddenException('Wrong password')

    // TODO: select only id field
    const { password, ...result } = user;
    return result;

  }

}