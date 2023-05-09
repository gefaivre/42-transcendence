import { IsNotEmpty, IsNumber, IsString, Validate } from "class-validator"
import { UserExist } from "../rules/user-exist.rule"
import { ChannelExist } from "../rules/channel-exist.rule"

export class UpdateChannelMemberDto {

  @IsNumber()
  @IsNotEmpty()
  @Validate(UserExist)
  userId: number

  @IsString()
  @IsNotEmpty()
  @Validate(ChannelExist)
  channelName: string

}