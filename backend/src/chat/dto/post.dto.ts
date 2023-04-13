import { IsNotEmpty, IsString } from 'class-validator'

export class PostDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  channelName: string;
}

export class PostEmitDto extends PostDto {
  @IsNotEmpty()
  @IsString()
  author: string;
}
