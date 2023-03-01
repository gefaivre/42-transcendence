import {
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
