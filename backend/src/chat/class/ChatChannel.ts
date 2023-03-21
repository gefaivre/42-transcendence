import { IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";
import { ChatUser } from "./ChatUser";

export class ChatChannel {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  id: number

  @IsArray()
  users: ChatUser[];
}
