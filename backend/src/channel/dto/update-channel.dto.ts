import { PartialType } from '@nestjs/swagger';
import { CreateChannelDto } from 'src/chat/dto/channel-dto';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
