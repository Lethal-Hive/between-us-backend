import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDatabaseModel } from 'src/utils/mongoose.utils';
import { Lobby, LobbyDocument, LobbyModel } from './entities/lobby.entity';
import { I18nService } from 'src/common/i18n/i18n.service';
import {
  ApplyLobbyPasswordDto,
  CancelGameDto,
  CreateLobbyDto,
  EditLobbySettingsDto,
  EndTurnDto,
  GetLobbyDto,
  GetLobbyGameDto,
  JoinLobbyDto,
  KickPlayerDto,
  KickPlayerInRoomDto,
  LeaveLobbyDto,
  StartLobbyDto,
  StartTurnDto,
  VotedForDto,
} from './dto/lobby.dto';
import {
  GameLanguage,
  LobbyMode,
  LobbyStatus,
} from './constants/lobby.constants';
import { GameGateway } from '../game/gateway/game.gateway';
import { UserDocument } from '../user/entities/user.entity';
import { PlayerService } from '../player/player.service';
import { GameService } from '../game/game.service';
import {
  GameStartedEvent,
  LobbySettingsUpdatedEvent,
  NewPlayerJoinedEvent,
  NewVoteEvent,
  NextTurnEvent,
  PlayerBackOnlineEvent,
  PlayerLeftEvent,
  RevealYourWordEvent,
  RoomClosedEvent,
  TimerStartedEvent,
  VotingResultsEvent,
  WordChangedEvent,
} from '../game/constants/game.events';
import { WordService } from '../word/word.service';
import { CategoryService } from '../category/category.service';
import { GameStatus } from '../game/constants/game.constants';
import { GameDocument } from '../game/entities/game.entity';
import { Types } from 'mongoose';
import { CategoryDocument } from '../category/entities/category.entity';
import { WordDocument } from '../word/entities/word.entity';
import { shuffle } from 'src/utils/helpers.utils';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  TURN_QUEUE,
  TURN_TIMER_JOB,
  TurnTimerJobData,
} from './turn-queue.processor';

@Injectable()
export class LobbyService {
  constructor(
    @InjectDatabaseModel(Lobby.name) private lobbyModel: LobbyModel,
    @InjectQueue(TURN_QUEUE)
    private readonly turnQueue: Queue<TurnTimerJobData>,
    private readonly gameGateway: GameGateway,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly wordService: WordService,
    private readonly categoryService: CategoryService,
    private readonly i18n: I18nService,
  ) {}

  async getActiveLobbyGame(
    user: UserDocument,
    lobby: LobbyDocument,
    game: GameDocument,
  ): Promise<any> {
    const players = await this.playerService
      .find({ lobby: lobby._id })

      .lean();

    this.gameGateway.ws.to(lobby._id.toString()).emit(PlayerBackOnlineEvent, {
      _id: user._id.toString(),
      username:
        players.find((player) => player.user.toString() === user._id.toString())
          ?.username || 'Unknown',
    });

    const connectedSockets = this.gameGateway.userSockets.get(
      user._id.toString(),
    );

    this.gameGateway.ws
      .in(connectedSockets as string[])
      .socketsJoin(game._id.toString());

    const isInPlayerList = players.some(
      (player) => player.user.toString() === user._id.toString(),
    );

    return {
      lobby,
      players: players.map((player) => {
        return {
          ...player,
          isHost: player.user.toString() === lobby.user.toString(),
        };
      }),
      isInPlayerList,
      game,
    };
  }
  async getEndedLobbyGame(
    user: UserDocument,
    lobby: LobbyDocument,
  ): Promise<any> {
    const players = await this.playerService.find({ lobby: lobby._id }).lean();

    this.gameGateway.ws.to(lobby._id.toString()).emit(PlayerBackOnlineEvent, {
      _id: user._id.toString(),
      username:
        players.find((player) => player.user.toString() === user._id.toString())
          ?.username || 'Unknown',
    });

    const connectedSockets = this.gameGateway.userSockets.get(
      user._id.toString(),
    );
    this.gameGateway.ws
      .in(connectedSockets as string[])
      .socketsJoin(lobby._id.toString());

    const isInPlayerList = players.some(
      (player) => player.user.toString() === user._id.toString(),
    );

    return {
      lobby,
      players: players.map((player) => {
        return {
          ...player,
          isHost: player.user.toString() === lobby.user.toString(),
        };
      }),
      isInPlayerList,
      game: null,
    };
  }

  async getLobby(user: UserDocument, getLobbyDto: GetLobbyDto): Promise<any> {
    const lobby = await this.lobbyModel.findOne({ code: getLobbyDto.code });

    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    const game = await this.gameService
      .findOne({
        lobby: lobby._id,
      })
      .sort({ createdAt: -1 });

    if (game) {
      if (game.status === GameStatus.Ended) {
        return await this.getEndedLobbyGame(user, lobby);
      } else {
        return await this.getActiveLobbyGame(user, lobby, game);
      }
    } else {
      return await this.getEndedLobbyGame(user, lobby);
    }
  }

  async getLobbyGame(user: UserDocument, getLobbyGameDto: GetLobbyGameDto) {
    const game = await this.gameService
      .findOne({ _id: getLobbyGameDto.game })
      .populate<{ category: CategoryDocument }>('category')
      .populate<{ fakeWord: WordDocument }>('fakeWord')
      .populate<{ word: WordDocument }>('word');
    if (!game) return this.i18n.error(NotFoundException, 'GAME.NOT_FOUND');

    if (game.status === GameStatus.Ended)
      return this.i18n.error(NotFoundException, 'GAME.ENDED');

    const players = await this.playerService.find({ lobby: game.lobby });

    const currentPlayer = players.find(
      (player) => player.user.toString() === user._id.toString(),
    );
    if (!currentPlayer) return;
    const connectedSockets = this.gameGateway.userSockets.get(
      user._id.toString(),
    );

    this.gameGateway.ws
      .in(connectedSockets as string[])
      .socketsJoin(game._id.toString());

    this.gameGateway.ws.to(game.lobby.toString()).emit(PlayerBackOnlineEvent, {
      _id: user._id.toString(),
      username:
        players.find((player) => player.user.toString() === user._id.toString())
          ?.username || 'Unknown',
    });

    this.gameGateway.ws
      .in(connectedSockets as string[])
      .emit(RevealYourWordEvent, {
        word: game.imposters.includes(currentPlayer._id.toString())
          ? game.settings.fakeWord
            ? game.fakeWord.name[
                game.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
              ] ===
              game.word.name[
                game.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
              ]
              ? game.gameLanguage === GameLanguage.ENGLISH
                ? 'Unknown'
                : 'غير معروف'
              : game.fakeWord.name[
                  game.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
                ]
            : null
          : game.word.name[
              game.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
            ],
        category:
          game.category.name[
            game.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
          ],
      });

    (game as any).category = {
      _id: game.category._id.toString(),
      name: game.category.name[
        game.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
      ],
    };
    (game as any).word = undefined;
    (game as any).fakeWord = undefined;
    (game as any).imposters = undefined;
    (game as any).players = undefined;

    return { game, players };
  }

  async createLobby(user: UserDocument, createLobbyDto: CreateLobbyDto) {
    if (!createLobbyDto.category) {
      createLobbyDto.mode = LobbyMode.Random;
    }
    const lobby = await this.lobbyModel.create({
      ...createLobbyDto,
      user: user._id,
    });

    await this.playerService.create({
      lobby: lobby._id,
      user: user._id,
      username: createLobbyDto.username,
    });

    const connectedSockets = this.gameGateway.userSockets.get(
      user._id.toString(),
    );

    if (connectedSockets?.length) {
      this.gameGateway.ws
        .in(connectedSockets)
        .socketsJoin(lobby._id.toString());
    }

    return lobby;
  }

  async editLobbySettings(
    user: UserDocument,
    editLobbySettingsDto: EditLobbySettingsDto,
    lobbyId: string,
  ) {
    if (!editLobbySettingsDto.category) {
      editLobbySettingsDto.mode = LobbyMode.Random;
    }

    const lobby = await this.lobbyModel.findOneAndUpdate(
      {
        _id: lobbyId,
        user: user._id,
      },
      {
        $set: {
          ...editLobbySettingsDto,
        },
      },
      {
        new: true,
      },
    );

    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (editLobbySettingsDto.username) {
      const player = await this.playerService.findOne({
        lobby: lobby._id,
        user: user._id,
      });

      if (player) {
        player.username = editLobbySettingsDto.username;
        await player.save();
      }
    }

    this.gameGateway.ws
      .to(lobby._id.toString())
      .emit(LobbySettingsUpdatedEvent, {
        impostersCount: lobby.imposterCount,
        roundsCount: lobby.roundsCount,
        timerPerRound: lobby.timerPerRound,
        fakeWord: lobby.fakeWord,
        NSFWWords: lobby.showNSFWWords,
        gameLanguage: lobby.gameLanguage,
        username: editLobbySettingsDto.username,
      });

    return {
      edited: true,
    };
  }
  async joinLobby(user: UserDocument, joinLobbyDto: JoinLobbyDto) {
    const lobby = await this.lobbyModel.findOne({ code: joinLobbyDto.code });

    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (!lobby.password) {
      await this.playerService.create({
        lobby: lobby._id,
        user: user._id,
        username: joinLobbyDto.username,
      });

      const connectedSockets = this.gameGateway.userSockets.get(
        user._id.toString(),
      );

      if (connectedSockets?.length) {
        this.gameGateway.ws
          .in(connectedSockets)
          .socketsJoin(lobby._id.toString());
      }

      this.gameGateway.ws.to(lobby._id.toString()).emit(NewPlayerJoinedEvent, {
        _id: user._id.toString(),
        username: joinLobbyDto.username,
      });

      return {
        lobby,
        requirePassword: false,
        joined: true,
      };
    }

    lobby.password = null;

    return {
      lobby,
      requirePassword: true,
      joined: false,
    };
  }

  async applyLobbyPassword(
    user: UserDocument,
    applyLobbyPasswordDto: ApplyLobbyPasswordDto,
  ) {
    const lobby = await this.lobbyModel.findOne({
      code: applyLobbyPasswordDto.code,
    });

    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (!lobby.password || lobby.password !== applyLobbyPasswordDto.password)
      return this.i18n.error(NotFoundException, 'LOBBY.INVALID_PASSWORD');

    await this.playerService.create({
      lobby: lobby._id,
      user: user._id,
      username: applyLobbyPasswordDto.username,
    });

    const connectedSockets = this.gameGateway.userSockets.get(
      user._id.toString(),
    );

    if (connectedSockets?.length) {
      this.gameGateway.ws
        .in(connectedSockets)
        .socketsJoin(lobby._id.toString());
    }

    this.gameGateway.ws.to(lobby._id.toString()).emit(NewPlayerJoinedEvent, {
      _id: user._id.toString(),
      username: applyLobbyPasswordDto.username,
    });

    return {
      lobby,
      requirePassword: true,
      joined: true,
    };
  }

  async leaveLobby(user: UserDocument, leaveLobbyDto: LeaveLobbyDto) {
    const lobby = await this.lobbyModel.findOne({
      _id: leaveLobbyDto.lobby,
    });
    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (lobby.user.toString() === user._id.toString()) {
      await this.playerService.deleteMany({ lobby: lobby._id });

      this.gameGateway.ws.to(lobby._id.toString()).emit(RoomClosedEvent, {
        host: user._id.toString(),
      });

      this.gameGateway.ws.socketsLeave(lobby._id.toString());

      await lobby.deleteOne();
    } else {
      const player = await this.playerService.findOne({
        lobby: lobby._id,
        user: user._id,
      });

      const username = player?.username || 'Unknown';
      if (player) {
        await player.deleteOne();
      }

      const connectedSockets = this.gameGateway.userSockets.get(
        user._id.toString(),
      );

      if (connectedSockets?.length) {
        this.gameGateway.ws
          .in(connectedSockets)
          .socketsLeave(lobby._id.toString());
      }

      this.gameGateway.ws.to(lobby._id.toString()).emit(PlayerLeftEvent, {
        _id: user._id.toString(),
        username,
      });
    }

    return {
      left: true,
    };
  }

  async kickPlayer(user: UserDocument, kickPlayerDto: KickPlayerDto) {
    const lobby = await this.lobbyModel.findOne({
      _id: kickPlayerDto.lobby,
    });
    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (lobby.user.toString() !== user._id.toString())
      return this.i18n.error(NotFoundException, 'LOBBY.NOT_HOST');

    const player = await this.playerService.findOne({
      lobby: lobby._id,
      user: kickPlayerDto.kickedUser,
    });

    if (!player) return this.i18n.error(NotFoundException, 'PLAYER.NOT_FOUND');
    const username = player?.username || 'Unknown';

    this.gameGateway.ws.to(lobby._id.toString()).emit(PlayerLeftEvent, {
      _id: kickPlayerDto.kickedUser,
      username,
    });

    await player.deleteOne();

    const connectedSockets = this.gameGateway.userSockets.get(
      kickPlayerDto.kickedUser,
    );

    if (connectedSockets?.length) {
      this.gameGateway.ws
        .in(connectedSockets)
        .socketsLeave(lobby._id.toString());
    }

    return {
      kicked: true,
    };
  }

  async startLobby(user: UserDocument, startLobbyDto: StartLobbyDto) {
    const lobby = await this.lobbyModel.findOne({
      _id: startLobbyDto.lobby,
    });

    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (lobby.user.toString() !== user._id.toString())
      return this.i18n.error(NotFoundException, 'LOBBY.NOT_HOST');

    lobby.status = LobbyStatus.IN_GAME;
    await lobby.save();

    const players = await this.playerService.find({ lobby: lobby._id });

    // if (players.length < 3)
    //   return this.i18n.error(NotFoundException, 'LOBBY.NOT_ENOUGH_PLAYERS');

    const mappedPlayers = shuffle(players);

    const categoryAndWord = {};
    let categoryName;
    let wordName;
    let fakeWord;

    if (lobby.mode === LobbyMode.Category) {
      const sortedCategories = shuffle(lobby.category);
      const category = await this.categoryService.findOne({
        _id: sortedCategories[0],
      });
      if (!category)
        return this.i18n.error(NotFoundException, 'CATEGORY.NOT_FOUND');

      categoryAndWord['category'] = category._id.toString();

      categoryName =
        category.name[
          lobby.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
        ];

      const filter = lobby.showNSFWWords
        ? {
            category: new Types.ObjectId(categoryAndWord['category']),
            $or: [
              {
                isNSFW: true,
              },
            ],
          }
        : {
            category: new Types.ObjectId(categoryAndWord['category']),
            isNSFW: false,
          };
      const word = await this.wordService.aggregate([
        {
          $match: filter,
        },
        {
          $sample: {
            size: 1,
          },
        },
      ]);

      if (!word.length)
        return this.i18n.error(
          NotFoundException,
          'WORD.NOT_FOUND_FOR_CATEGORY',
        );

      categoryAndWord['word'] = word[0]._id.toString();
      wordName = word[0].name;
    } else {
      const category = await this.categoryService.aggregate([
        {
          $sample: {
            size: 1,
          },
        },
      ]);

      if (!category.length)
        return this.i18n.error(NotFoundException, 'CATEGORY.NOT_FOUND');

      categoryAndWord['category'] = category[0]._id.toString();
      categoryName =
        category[0].name[
          lobby.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'
        ];

      const filter = lobby.showNSFWWords
        ? {
            category: new Types.ObjectId(categoryAndWord['category']),
            $or: [
              {
                isNSFW: true,
              },
            ],
          }
        : {
            category: new Types.ObjectId(categoryAndWord['category']),
            isNSFW: false,
          };

      const word = await this.wordService.aggregate([
        {
          $match: filter,
        },
        {
          $sample: {
            size: 1,
          },
        },
      ]);

      if (!word.length)
        return this.i18n.error(
          NotFoundException,
          'WORD.NOT_FOUND_FOR_CATEGORY',
        );

      categoryAndWord['word'] = word[0]._id.toString();
      wordName =
        word[0].name[lobby.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'];
    }

    if (lobby.fakeWord) {
      const filter = lobby.showNSFWWords
        ? {
            category: new Types.ObjectId(categoryAndWord['category']),
            $or: [
              {
                isNSFW: true,
              },
            ],
          }
        : {
            category: new Types.ObjectId(categoryAndWord['category']),
            isNSFW: false,
          };
      const word = await this.wordService.aggregate([
        {
          $match: filter,
        },
        {
          $sample: {
            size: 1,
          },
        },
      ]);

      if (!word.length)
        return this.i18n.error(
          NotFoundException,
          'WORD.NOT_FOUND_FOR_CATEGORY',
        );

      categoryAndWord['fakeWord'] = word[0]._id.toString();
      fakeWord =
        word[0].name[lobby.gameLanguage === GameLanguage.ENGLISH ? 'en' : 'ar'];
    }

    const imposters = shuffle(mappedPlayers)
      .slice(0, lobby.imposterCount)
      .map((player) => player._id.toString());

    const game = await this.gameService.create({
      user: user._id,
      lobby: lobby._id,
      gameLanguage: lobby.gameLanguage,
      ...categoryAndWord,
      settings: {
        fakeWord: lobby.fakeWord,
        showNSFWWords: lobby.showNSFWWords,
        imposterCount: lobby.imposterCount,
        roundsCount: lobby.roundsCount,
        timerPerRound: lobby.timerPerRound,
      },
      players: mappedPlayers.map((player) => player._id.toString()),
      imposters,
      currentPlayerTurn: mappedPlayers[0]._id.toString(),
    });

    this.gameGateway.ws
      .in(lobby._id.toString())
      .socketsJoin(game._id.toString());

    this.gameGateway.ws.to(game._id.toString()).emit(GameStartedEvent, {
      gameId: game._id.toString(),
      turns: mappedPlayers,
      gameLanguage: lobby.gameLanguage,
      category: categoryName,
      fakeWord: lobby.fakeWord,
      showNSFWWords: lobby.showNSFWWords,
      imposterCount: lobby.imposterCount,
      roundsCount: lobby.roundsCount,
      timerPerRound: lobby.timerPerRound,
    });

    for (const player of mappedPlayers) {
      const connectedSockets = this.gameGateway.userSockets.get(
        player.user.toString(),
      );

      this.gameGateway.ws
        .in(connectedSockets as string[])
        .emit(RevealYourWordEvent, {
          word: imposters.includes(player._id.toString())
            ? lobby.fakeWord
              ? fakeWord === wordName
                ? game.gameLanguage === GameLanguage.ENGLISH
                  ? 'Unknown'
                  : 'غير معروف'
                : fakeWord
              : null
            : wordName,
          category: categoryName,
        });
    }

    return {
      started: true,
    };
  }

  async voteForTheImposter(user: UserDocument, votedForDto: VotedForDto) {
    const player = await this.playerService.findOne({
      lobby: votedForDto.lobby,
      user: user._id,
    });

    if (!player) return this.i18n.error(NotFoundException, 'PLAYER.NOT_FOUND');

    const game = await this.gameService.findOne({
      _id: votedForDto.game,
      players: {
        $in: [player._id.toString()],
      },
    });

    if (!game) return this.i18n.error(NotFoundException, 'GAME.NOT_FOUND');

    if (game.status !== GameStatus.Voting)
      return this.i18n.error(NotFoundException, 'GAME.NOT_IN_VOTING_PHASE');

    const isVotedBefore = game.votes.find(
      (vote) => vote.voter === player._id.toString(),
    );

    if (isVotedBefore)
      return this.i18n.error(NotFoundException, 'GAME.ALREADY_VOTED');

    const votedOnPlayer = await this.playerService.findOne({
      lobby: votedForDto.lobby,
      _id: votedForDto.votedOn,
    });

    if (!votedOnPlayer)
      return this.i18n.error(NotFoundException, 'PLAYER.NOT_FOUND');

    game.votes.push({
      voter: player._id.toString(),
      votedOn: votedOnPlayer._id.toString(),
    });

    this.gameGateway.ws.to(game._id.toString()).emit(NewVoteEvent, {
      voter: player._id.toString(),
      votedOn: votedOnPlayer._id.toString(),
      totalVotes: game.votes.length,
    });

    if (game.votes.length >= game.players.length) {
      const players = await this.playerService.find({
        lobby: game.lobby,
        _id: {
          $in: game.players,
        },
      });

      const votes = game.votes.map((vote) => {
        const voter = players.find(
          (player) => player._id.toString() === vote.voter,
        );
        const votedOn = players.find(
          (player) => player._id.toString() === vote.votedOn,
        );

        return {
          voter: {
            _id: voter?._id.toString(),
            username: voter?.username,
          },
          votedOn: {
            _id: votedOn?._id.toString(),
            username: votedOn?.username,
          },
        };
      });

      const imposters = game.imposters.map((imposter) => {
        const imposterPlayer = players.find(
          (player) => player._id.toString() === imposter.toString(),
        );

        return {
          _id: imposterPlayer?._id.toString(),
          username: imposterPlayer?.username,
        };
      });

      this.gameGateway.ws.to(game._id.toString()).emit(VotingResultsEvent, {
        votes,
        imposters,
      });
      game.status = GameStatus.Ended;
    }

    await game.save();

    return {
      voted: true,
    };
  }

  async startTurn(user: UserDocument, startTurnDto: StartTurnDto) {
    const game = await this.gameService.findOne({ _id: startTurnDto.game });

    if (!game) return this.i18n.error(NotFoundException, 'GAME.NOT_FOUND');

    if (game.status !== GameStatus.Live)
      return this.i18n.error(NotFoundException, 'GAME.NOT_LIVE');

    const lobby = await this.lobbyModel.findOne({ _id: game.lobby });
    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (lobby.user.toString() !== user._id.toString())
      return this.i18n.error(NotFoundException, 'LOBBY.NOT_HOST');
    const startingPlayerId = game.currentPlayerTurn;
    const gameId = game._id.toString();
    const timerMs = game.settings.timerPerRound * 1000;
    game.isGameStarted = true;
    await game.save();

    await this.turnQueue.add(
      TURN_TIMER_JOB,
      { gameId },
      {
        jobId: `turn-${game._id.toString()}-${startingPlayerId}`,
        delay: timerMs,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    this.gameGateway.ws.to(game._id.toString()).emit(TimerStartedEvent, true);

    return { started: true };
  }

  async endTurn(user: UserDocument, endTurnDto: EndTurnDto) {
    const game = await this.gameService.findOne({ _id: endTurnDto.game });

    if (!game) return this.i18n.error(NotFoundException, 'GAME.NOT_FOUND');

    const player = await this.playerService.findOne({
      lobby: game.lobby,
      user: user._id,
    });

    if (!player) return this.i18n.error(NotFoundException, 'PLAYER.NOT_FOUND');

    if (game.status !== GameStatus.Live)
      return this.i18n.error(NotFoundException, 'GAME.NOT_LIVE');

    try {
      await this.turnQueue.remove(
        `turn-${game._id.toString()}-${game.currentPlayerTurn.toString()}`,
      );
    } catch {
      /* empty */
    }

    await this.turnQueue.add(
      TURN_TIMER_JOB,
      { gameId: game._id.toString() },
      {
        jobId: `end-turn-${game._id.toString()}`,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
    return { ended: true };
  }

  // async kickPlayerInRoom(
  //   user: UserDocument,
  //   kickPlayerInRoomDto: KickPlayerInRoomDto,
  // ) {
  //   const game = await this.gameService.findOne({
  //     _id: kickPlayerInRoomDto.game,
  //     user: user._id,
  //   });

  //   if (!game) return this.i18n.error(NotFoundException, 'GAME.NOT_FOUND');

  //   const player = await this.playerService.findOne({
  //     lobby: game.lobby,
  //     user: kickPlayerInRoomDto.kickedUser,
  //   });

  //   if (!player) return this.i18n.error(NotFoundException, 'PLAYER.NOT_FOUND');

  //   game.players = game.players.filter(
  //     (p) => p.toString() !== player._id.toString(),
  //   );

  // }

  async skipToVoting(user: UserDocument, startTurnDto: StartTurnDto) {
    const game = await this.gameService.findOne({ _id: startTurnDto.game });

    if (!game) return this.i18n.error(NotFoundException, 'GAME.NOT_FOUND');

    if (game.status !== GameStatus.Live)
      return this.i18n.error(NotFoundException, 'GAME.NOT_LIVE');

    try {
      await this.turnQueue.remove(
        `turn-${game._id.toString()}-${game.currentPlayerTurn.toString()}`,
      );
    } catch {
      /* empty */
    }

    game.status = GameStatus.Voting;
    await game.save();

    this.gameGateway.ws
      .to(game._id.toString())
      .emit(NextTurnEvent, { votePhase: true });

    return { skipped: true };
  }
  async cancelTheGame(user: UserDocument, cancelGameDto: CancelGameDto) {
    const lobby = await this.lobbyModel.findOne({
      _id: cancelGameDto.lobby,
    });

    if (!lobby) return this.i18n.error(NotFoundException, 'LOBBY.NOT_FOUND');

    if (lobby.user.toString() !== user._id.toString())
      return this.i18n.error(NotFoundException, 'LOBBY.NOT_HOST');

    const lastGame = await this.gameService
      .findOne({
        lobby: lobby._id,
      })
      .sort({ createdAt: -1 });

    if (!lastGame) return this.i18n.error(NotFoundException, 'GAME.NOT_FOUND');

    if (lastGame.status === GameStatus.Ended)
      return this.i18n.error(NotFoundException, 'GAME.NOT_LIVE');

    await lastGame.deleteOne();

    this.gameGateway.ws.to(lobby._id.toString()).emit(WordChangedEvent, {
      returnToLobby: true,
    });

    return { canceled: true };
  }
}
