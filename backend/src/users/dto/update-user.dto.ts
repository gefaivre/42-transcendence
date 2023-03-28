import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// TODO
// export class UpdateGameStatsDto extends PickType(CreateUserDto, ['mmr', 'games'] as const) {}
export class UpdateUserDto extends PartialType(CreateUserDto) {

    mmr: number;

    games: number;

}

export class UpdateUsernameDto extends PickType(CreateUserDto, ['username'] as const) {}