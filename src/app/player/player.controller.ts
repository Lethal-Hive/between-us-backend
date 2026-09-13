import { SwaggerAuthController } from 'src/common/swagger/decorators/swagger.decorator';
import { PlayerService } from './player.service';

@SwaggerAuthController('Player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
}
