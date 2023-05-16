import { ArgumentMetadata, BadRequestException, Injectable, ParseIntPipe, PipeTransform } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class UserByIdPipe extends ParseIntPipe implements PipeTransform<string, Promise<any>> {

  constructor (private readonly userService: UsersService) {
    super()
  }

  async transform(value: string, metadata: ArgumentMetadata): Promise<any> {
    const val: number = await super.transform(value, metadata)
    const user: any = await this.userService.findById(val)
    if (user === null)
      throw new BadRequestException('Validation failed (user not found)')
    return user
  }
}
