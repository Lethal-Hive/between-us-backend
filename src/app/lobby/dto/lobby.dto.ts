import { ApiProperty, PartialType } from '@nestjs/swagger';
import { GameLanguage, LobbyMode } from '../constants/lobby.constants';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLobbyDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby username',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: [String],
    required: true,
    description: 'Lobby category',
    example: ['5f9f9f9f9f9f9f9f9f9f9f9f'],
  })
  @IsMongoId({ each: true })
  @IsOptional()
  category: string[];

  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby password',
    example: 'secret',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Game language',
    enum: GameLanguage,
    example: GameLanguage.ENGLISH,
  })
  @IsEnum(GameLanguage)
  @IsOptional()
  gameLanguage: GameLanguage;

  @ApiProperty({
    type: Boolean,
    required: true,
    description: 'Lobby fake word for impostors',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  fakeWord: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
    description: 'Lobby showNSFWWords for non-impostors',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showNSFWWords: boolean;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Set imposters count (1 or 2 or more)',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  imposterCount: boolean;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Set rounds count (1 or 2 or more)',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  roundsCount: boolean;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'the minimum time for each round in seconds (15 or more)',
    example: 60,
  })
  @IsNumber()
  @Min(15)
  @IsOptional()
  timerPerRound: number;

  mode: LobbyMode;
}

export class EditLobbySettingsDto extends PartialType(CreateLobbyDto) {}

export class JoinLobbyDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby username',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby code',
    example: 'LYX-O9Q',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ApplyLobbyPasswordDto extends PartialType(JoinLobbyDto) {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby password',
    example: 'secret',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LeaveLobbyDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  lobby: string;
}

export class StartLobbyDto extends PartialType(LeaveLobbyDto) {}

export class KickPlayerDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  lobby: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Kicked user id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  kickedUser: string;
}

export class KickPlayerInRoomDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  game: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Kicked user id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  kickedUser: string;
}

export class VotedForDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Game id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  game: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  lobby: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Voted player id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  votedOn: string;
}

export class GetLobbyDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby code',
    example: 'LYX-O9Q',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class GetLobbyGameDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Game id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  game: string;
}

export class EndTurnDto extends PartialType(GetLobbyGameDto) {}

export class StartTurnDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Game id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  game: string;
}

export class CancelGameDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Lobby id',
    example: '5f9f9f9f9f9f9f9f9f9f9f9f',
  })
  @IsMongoId()
  lobby: string;
}
