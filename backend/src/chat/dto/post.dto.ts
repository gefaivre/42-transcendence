import { IsNotEmpty, IsString, IsDate } from 'class-validator'
import { User } from 'src/users/entities/user.entity';

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

  @IsNotEmpty()
  @IsDate()
  date: Date;
}

export class newPostEmitDto extends PostDto {
  @IsNotEmpty()
  @IsString()
  author: User;
}
