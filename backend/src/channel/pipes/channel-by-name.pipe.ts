import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ChannelService } from "../channel.service";

@Injectable()
export class ChannelByNamePipe implements PipeTransform<string, Promise<any>> {

  constructor (private readonly channelService: ChannelService) {}

  async transform(channelName: string, metadata: ArgumentMetadata): Promise<any> {
    const channel: any = await this.channelService.findByName(channelName)
    if (channel === null)
      throw new BadRequestException('Validation failed (channel not found)')
    return channel
  }
}
