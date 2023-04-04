import {
    IsNotEmpty,
    IsInt,
    IsBoolean,
    IsDate,
    Min,
    Max,
    IsString,
  } from 'class-validator';
export class CreateChannelDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    ownerId: number;


}