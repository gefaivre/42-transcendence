import { IsNotEmpty, IsString } from 'class-validator'
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
}

export class newPostEmitDto extends PostDto {
  @IsNotEmpty()
  @IsString()
  author: User;
}
