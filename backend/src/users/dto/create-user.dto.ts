import {
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    image: URL;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    ft_login: string;
}
