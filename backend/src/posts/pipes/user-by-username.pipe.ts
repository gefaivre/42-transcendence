
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class UserByUsernamePipe implements PipeTransform<string, Promise<any>> {

  constructor (private readonly userService: UsersService) {}

  async transform(value: string, metadata: ArgumentMetadata): Promise<any> {
    const user: any = await this.userService.findByUsername(value)
    if (user === null)
      throw new BadRequestException('Validation failed (user not found)')
    return user
  }
}
