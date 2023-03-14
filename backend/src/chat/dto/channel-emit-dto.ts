import { IsString, IsNotEmpty } from 'class-validator'

export class ChannelEmitDto {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
