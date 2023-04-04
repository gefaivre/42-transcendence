import { IsNotEmpty, IsString } from "class-validator";

export class PostEmitDto {
  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  author: string;
}
