import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class joinChannelDto {
  @IsNotEmpty()
  @IsString()
  channelName: string;
}

