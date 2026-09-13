import {
  SwaggerApiDoc,
  SwaggerApiResponseDoc,
} from 'src/common/swagger/decorators/swagger.decorator';
import {
  SwaggerTagName,
  SwaggerTagNumber,
} from 'src/constants/swagger.constants';

import { ENUM_SWAGGER_TAG_TYPE } from 'src/common/swagger/constants/swagger.constants';
import { GameStatus } from 'src/app/game/constants/game.constants';
import { Lobby } from '../entities/lobby.entity';
import { LobbyStatus } from '../constants/lobby.constants';
import { applyDecorators } from '@nestjs/common';

export function SwaggerGetLobbyDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Get lobby information',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby information retrieved successfully',
      isArray: false,
      dto: {
        lobby: {
          _id: '5f8d0d55b54764421b7156c5',
          code: 'LYX-1Q4',
          mode: 'Category',
          category: '5f8d0d55b54764421b7156c5',
          user: '5f8d0d55b54764421b7156c5',
          password: 'secret | null',
          status: LobbyStatus.IN_GAME,
          fakeWord: false,
          showNSFWWords: false,
          impostersCount: 2,
          timerPerRound: 60,
        },
        players: {
          _id: '5f8d0d55b54764421b7156c5',
          username: 'player1',
          user: '5f8d0d55b54764421b7156c5',
        },
        game: {
          _id: '5f8d0d55b54764421b7156c5',
          lobby: '5f8d0d55b54764421b7156c5',
          word: '5f8d0d55b54764421b7156c5',
          status: GameStatus.Ended,
          settings: {
            fakeWord: false,
            showNSFWWords: false,
            imposterCount: 2,
            timerPerRound: 60,
          },
          votes: [
            {
              voter: '5f8d0d55b54764421b7156c5',
              votedOn: '5f8d0d55b54764421b7156c5',
            },
          ],
          currentRound: 1,
          currentPlayerTurn: '5f8d0d55b54764421b7156c5',
        },
      },
    }),
  );
}

export function SwaggerGetLobbyGameDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Get lobby game information',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby game information retrieved successfully',
      isArray: false,
      dto: {
        players: {
          _id: '5f8d0d55b54764421b7156c5',
          username: 'player1',
          user: '5f8d0d55b54764421b7156c5',
        },
        game: {
          _id: '5f8d0d55b54764421b7156c5',
          lobby: '5f8d0d55b54764421b7156c5',
          word: '5f8d0d55b54764421b7156c5',
          status: GameStatus.Ended,
          settings: {
            fakeWord: false,
            showNSFWWords: false,
            imposterCount: 2,
            timerPerRound: 60,
          },
          votes: [
            {
              voter: '5f8d0d55b54764421b7156c5',
              votedOn: '5f8d0d55b54764421b7156c5',
            },
          ],
          currentRound: 1,
          currentPlayerTurn: '5f8d0d55b54764421b7156c5',
        },
      },
    }),
  );
}

export function SwaggerCreateLobbyDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Create a new lobby',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby created successfully',
      isArray: false,
      dto: Lobby,
    }),
  );
}

export function SwaggerEditLobbyDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Edit lobby settings',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby settings updated successfully',
      isArray: false,
      dto: { edited: true },
    }),
  );
}

export function SwaggerJoinLobbyDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Join a lobby',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby joined successfully',
      isArray: false,
      dto: {
        lobby: {
          _id: '5f8d0d55b54764421b7156c5',
          code: 'LYX-1Q4',
          requirePassword: false,
          joined: false,
        },
      },
    }),
  );
}

export function SwaggerApplyLobbyPasswordDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Create a new lobby',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby created successfully',
      isArray: false,
      dto: Lobby,
    }),
  );
}

export function SwaggerLeaveLobbyDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Leave a lobby',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby left successfully',
      isArray: false,
      dto: {
        left: true,
      },
    }),
  );
}

export function SwaggerKickPlayerDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Kick a player from the lobby',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Player kicked successfully',
      isArray: false,
      dto: {
        kicked: true,
      },
    }),
  );
}

export function SwaggerStartLobbyDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Start the lobby game',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Lobby game started successfully',
      isArray: false,
      dto: {
        started: true,
      },
    }),
  );
}

export function SwaggerVoteForImposterDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Vote for the imposter',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.PUBLIC,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Vote cast successfully',
      isArray: false,
      dto: {
        voted: true,
      },
    }),
  );
}

export function SwaggerStartTurnDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Start the current player turn timer',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Turn timer started successfully',
      isArray: false,
      dto: {
        started: true,
      },
    }),
  );
}

export function SwaggerEndTurnDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'End the current player turn and move to the next player',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Turn ended successfully, moved to the next player',
      isArray: false,
      dto: {
        ended: true,
      },
    }),
  );
}

export function SwaggerSkipToVotingDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Skip to voting phase immediately',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Skipped to voting phase successfully',
      isArray: false,
      dto: {
        skipped: true,
      },
    }),
  );
}

export function SwaggerCancelTheGameDoc() {
  return applyDecorators(
    SwaggerApiDoc({
      summary: 'Cancel the current game and return to the lobby',
      tag: SwaggerTagName.Lobby,
      tagType: ENUM_SWAGGER_TAG_TYPE.AUTHENTICATION_REQUIRED,
      tagNumber: SwaggerTagNumber.LobbyAuthenticationRequired,
    }),

    SwaggerApiResponseDoc({
      status: 200,
      description: 'Game canceled successfully, returned to the lobby',
      isArray: false,
      dto: {
        canceled: true,
      },
    }),
  );
}
