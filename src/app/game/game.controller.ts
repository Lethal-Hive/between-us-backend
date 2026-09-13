import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';
import { GameService } from './game.service';
import {
  SwaggerGetAllConnectedUsersDoc,
  SwaggerGetLastPlayedGameDoc,
} from './docs/game.docs';
import { Get, UseGuards } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { ClerkAuthGuard } from 'src/guards/clerk.guard';

@SwaggerAuthController('Game')
@UseGuards(ClerkAuthGuard)
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameGateway: GameGateway,
  ) {}

  @SwaggerGetLastPlayedGameDoc()
  @Get('/last-played')
  getLastPlayedGame() {
    return this.gameService.getLastPlayedGame();
  }

  @SwaggerGetAllConnectedUsersDoc()
  @Get('/connected-users')
  getAllConnectedUsers() {
    return this.gameGateway.getAllConnectedClients();
  }
}
