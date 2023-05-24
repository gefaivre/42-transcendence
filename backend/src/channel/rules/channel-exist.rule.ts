import { Injectable } from "@nestjs/common";
import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { ChannelService } from "src/channel/channel.service";

ValidatorConstraint({ async: true })
@Injectable()
export class ChannelExist implements ValidatorConstraintInterface {

  constructor(private readonly channel: ChannelService) {}

  async validate(channelName: string): Promise<boolean> {
    console.log('validate channel exist')
    const channel = await this.channel.findByName(channelName)
    return channel !== null
  }

  defaultMessage(): string {
    return 'channel not found'
  }

}