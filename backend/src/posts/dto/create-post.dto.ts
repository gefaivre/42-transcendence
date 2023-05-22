import { IsInt, IsNotEmpty, IsString, IsDate } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  content:    string;

  @IsNotEmpty()
  @IsInt()
  authorId:   number;

  @IsNotEmpty()
  @IsInt()
  channelId:  number;

  @IsNotEmpty()
  @IsDate()
  date: Date;
}
