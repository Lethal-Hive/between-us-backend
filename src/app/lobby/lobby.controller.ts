import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';
import { LobbyService } from './lobby.service';
import {
  SwaggerApplyLobbyPasswordDoc,
  SwaggerCancelTheGameDoc,
  SwaggerCreateLobbyDoc,
  SwaggerEditLobbyDoc,
  SwaggerEndTurnDoc,
  SwaggerGetLobbyDoc,
  SwaggerGetLobbyGameDoc,
  SwaggerJoinLobbyDoc,
  SwaggerKickPlayerDoc,
  SwaggerLeaveLobbyDoc,
  SwaggerSkipToVotingDoc,
  SwaggerStartLobbyDoc,
  SwaggerStartTurnDoc,
  SwaggerVoteForImposterDoc,
} from './docs/lobby.docs';
import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from 'src/guards/clerk.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { UserDocument } from '../user/entities/user.entity';
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
  LeaveLobbyDto,
  StartLobbyDto,
  StartTurnDto,
  VotedForDto,
} from './dto/lobby.dto';
import { MongoIdParam } from 'src/utils/mongoose.utils';

@UseGuards(ClerkAuthGuard)
@SwaggerAuthController('Lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @SwaggerGetLobbyDoc()
  @Get('/get-lobby/:code')
  getLobby(@GetUser() user: UserDocument, @Param() getLobbyDto: GetLobbyDto) {
    return this.lobbyService.getLobby(user, getLobbyDto);
  }

  @SwaggerGetLobbyGameDoc()
  @Get('/get-lobby-game')
  getLobbyGame(
    @GetUser() user: UserDocument,
    @Query() getLobbyGameDto: GetLobbyGameDto,
  ) {
    return this.lobbyService.getLobbyGame(user, getLobbyGameDto);
  }

  @SwaggerCreateLobbyDoc()
  @Post('/')
  createLobby(
    @GetUser() user: UserDocument,
    @Body() createLobbyDto: CreateLobbyDto,
  ) {
    return this.lobbyService.createLobby(user, createLobbyDto);
  }

  @SwaggerEditLobbyDoc()
  @Patch('/edit-lobby-settings/:id')
  editLobbySettings(
    @GetUser() user: UserDocument,
    @Body() editLobbySettingsDto: EditLobbySettingsDto,
    @Param() mongoIdParam: MongoIdParam,
  ) {
    return this.lobbyService.editLobbySettings(
      user,
      editLobbySettingsDto,
      mongoIdParam.id,
    );
  }

  @SwaggerJoinLobbyDoc()
  @Post('/join-lobby')
  joinLobby(@GetUser() user: UserDocument, @Body() joinLobbyDto: JoinLobbyDto) {
    return this.lobbyService.joinLobby(user, joinLobbyDto);
  }

  @SwaggerApplyLobbyPasswordDoc()
  @Post('/apply-lobby-password')
  applyLobbyPassword(
    @GetUser() user: UserDocument,
    @Body() applyLobbyPasswordDto: ApplyLobbyPasswordDto,
  ) {
    return this.lobbyService.applyLobbyPassword(user, applyLobbyPasswordDto);
  }

  @SwaggerLeaveLobbyDoc()
  @Patch('/leave-lobby')
  leaveLobby(
    @GetUser() user: UserDocument,
    @Body() leaveLobbyDto: LeaveLobbyDto,
  ) {
    return this.lobbyService.leaveLobby(user, leaveLobbyDto);
  }

  @SwaggerKickPlayerDoc()
  @Patch('/kick-player')
  kickPlayer(
    @GetUser() user: UserDocument,
    @Body() kickPlayerDto: KickPlayerDto,
  ) {
    return this.lobbyService.kickPlayer(user, kickPlayerDto);
  }

  @SwaggerStartLobbyDoc()
  @Post('/start-lobby')
  startLobby(
    @GetUser() user: UserDocument,
    @Body() startLobbyDto: StartLobbyDto,
  ) {
    return this.lobbyService.startLobby(user, startLobbyDto);
  }

  @SwaggerVoteForImposterDoc()
  @Post('/vote-for-imposter')
  voteForTheImposter(
    @GetUser() user: UserDocument,
    @Body() votedForDto: VotedForDto,
  ) {
    return this.lobbyService.voteForTheImposter(user, votedForDto);
  }

  @SwaggerStartTurnDoc()
  @Post('/start-turn')
  startTurn(@GetUser() user: UserDocument, @Body() startTurnDto: StartTurnDto) {
    return this.lobbyService.startTurn(user, startTurnDto);
  }

  @SwaggerEndTurnDoc()
  @Post('/end-turn')
  endTurn(@GetUser() user: UserDocument, @Body() endTurnDto: EndTurnDto) {
    return this.lobbyService.endTurn(user, endTurnDto);
  }

  @SwaggerSkipToVotingDoc()
  @Post('/skip-to-voting')
  skipToVoting(
    @GetUser() user: UserDocument,
    @Body() startTurnDto: StartTurnDto,
  ) {
    return this.lobbyService.skipToVoting(user, startTurnDto);
  }

  @SwaggerCancelTheGameDoc()
  @Delete('/cancel-the-game')
  cancelTheGame(
    @GetUser() user: UserDocument,
    @Body() cancelGameDto: CancelGameDto,
  ) {
    return this.lobbyService.cancelTheGame(user, cancelGameDto);
  }
}
