import { IsString, IsNotEmpty } from 'class-validator'

export class ChannelDto {
  @IsNotEmpty()
  @IsString()
  channelName: string;
}
