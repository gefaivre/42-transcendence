import { IsString } from "class-validator";

export class RequestGameDto {
  @IsString()
  friend: string;
}
