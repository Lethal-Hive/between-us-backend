import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { I18nService } from 'src/common/i18n/i18n.service';
import { GameSockets } from '../game.sockets';
import { PlayerService } from 'src/app/player/player.service';
import { PlayerConnectionStatus } from 'src/app/player/constants/player.constants';
import {
  GameHeartBeatEvent,
  PlayerWentAwayEvent,
} from '../constants/game.events';
import { GameService } from '../game.service';
import { GameStatus } from '../constants/game.constants';

@WebSocketGateway(Number(process.env.SOCKET_PORT), {
  cors: '*:*',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);

  public userSockets: Map<string, string[]> = new Map();

  @WebSocketServer() ws: Server;

  constructor(
    private readonly i18n: I18nService,
    private readonly gameSockets: GameSockets,
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
  ) {}

  async handleDisconnect(client: Socket) {
    this.logger.verbose(`Client Disconnected: ${client.id}`);
    const token = client.handshake.auth?.token;
    const user = await this.gameSockets.getUser(token);
    if (!user) return client.disconnect();
    const previousSockets = this.userSockets.get(user._id.toString()) || [];
    const updatedSockets = previousSockets.filter(
      (id) => id.toString() !== client.id,
    );
    this.userSockets.set(user._id.toString(), updatedSockets);

    await this.playerService.updateMany(
      { user: user._id },
      { connectionStatus: PlayerConnectionStatus.Away },
    );

    const lastLobbyPlayedIn = await this.playerService
      .findOne({ user: user._id })
      .sort({ updatedAt: -1, createdAt: -1 });

    if (lastLobbyPlayedIn) {
      this.ws.to(lastLobbyPlayedIn.lobby.toString()).emit(PlayerWentAwayEvent, {
        _id: user._id.toString(),
        username: lastLobbyPlayedIn.username,
      });
    }
  }

  async handleConnection(client: Socket) {
    this.logger.verbose(`New client connected: ${client.id}`);
    const token = client.handshake.auth?.token;
    const user = await this.gameSockets.getUser(token);
    if (!user) return client.disconnect();
    const previousSockets = this.userSockets.get(user._id.toString()) || [];
    previousSockets.push(client.id);
    this.userSockets.set(user._id.toString(), previousSockets);

    await this.playerService.updateMany(
      { user: user._id },
      { connectionStatus: PlayerConnectionStatus.Active },
    );

    const lastLobbyPlayedIn = await this.playerService
      .findOne({ user: user._id })
      .sort({ updatedAt: -1, createdAt: -1 });

    const lastGamePlayedIn = await this.gameService.findOne({
      lobby: lastLobbyPlayedIn?.lobby,
    });

    if (lastLobbyPlayedIn) {
      await client.join(lastLobbyPlayedIn.lobby.toString());
    }

    if (lastGamePlayedIn && lastGamePlayedIn.status !== GameStatus.Ended) {
      await client.join(lastGamePlayedIn._id.toString());
    }
  }

  getAllConnectedClients() {
    return {
      users: this.ws.sockets.sockets.size,
    };
  }

  afterInit() {
    this.logger.verbose(
      `[GAME GATEWAY] - Websocket server initialized on port ${process.env.SOCKET_PORT}`,
    );

    setInterval(() => {
      this.ws.emit(GameHeartBeatEvent, { status: 'alive' });
    }, 10000);
  }
}
