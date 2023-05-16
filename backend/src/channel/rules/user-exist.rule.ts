import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UsersService } from "src/users/users.service";
import { ChannelService } from "../channel.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class UserExist implements ValidatorConstraintInterface {

  constructor(private readonly usersService: UsersService,
    private readonly channelService: ChannelService) {}

  async validate(userId: number): Promise<boolean> {

    const channel = await this.channelService.findByName('aaaaaa')
    console.log('channel', channel)

    console.log('validate user exist')
    const user = await this.usersService.findById(userId)
    return user !== null
  }

  defaultMessage(): string {
    return 'user not found'
  }

}