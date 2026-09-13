import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { GameService } from '../game/game.service';
import { GameGateway } from '../game/gateway/game.gateway';
import { GameStatus } from '../game/constants/game.constants';
import { NextTurnEvent } from '../game/constants/game.events';

export const TURN_QUEUE = 'turn-queue';
export const TURN_TIMER_JOB = 'turn-timer';

export interface TurnTimerJobData {
  gameId: string;
}

@Processor(TURN_QUEUE)
export class TurnQueueProcessor extends WorkerHost {
  constructor(
    private readonly gameService: GameService,
    private readonly gameGateway: GameGateway,
    @InjectQueue(TURN_QUEUE)
    private readonly turnQueue: Queue<TurnTimerJobData>,
  ) {
    super();
  }

  async process(job: Job<TurnTimerJobData>): Promise<void> {
    const { gameId } = job.data;

    const game = await this.gameService.findOne({ _id: gameId });
    if (!game || game.status !== GameStatus.Live) return;

    const currentIndex = game.players.findIndex(
      (p) => p.toString() === game.currentPlayerTurn.toString(),
    );
    const nextIndex = currentIndex + 1;
    const isRoundComplete = nextIndex >= game.players.length;
    const timerMs = game.settings.timerPerRound * 1000;
    if (isRoundComplete) {
      if (game.currentRound >= game.settings.roundsCount) {
        game.status = GameStatus.Voting;
        await game.save();
        this.gameGateway.ws
          .to(game._id.toString())
          .emit(NextTurnEvent, { votePhase: true });
      } else {
        game.currentRound += 1;
        game.currentPlayerTurn = game.players[0].toString();
        await game.save();
        this.gameGateway.ws.to(game._id.toString()).emit(NextTurnEvent, {
          currentPlayerTurn: game.currentPlayerTurn,
          currentRound: game.currentRound,
          votePhase: false,
        });
        await this.turnQueue.add(
          TURN_TIMER_JOB,
          { gameId },
          {
            jobId: `turn-${game._id.toString()}-${game.currentPlayerTurn.toString()}`,
            delay: timerMs,
            removeOnComplete: true,
            removeOnFail: true,
          },
        );
      }
    } else {
      game.currentPlayerTurn = game.players[nextIndex].toString();
      await game.save();
      this.gameGateway.ws.to(game._id.toString()).emit(NextTurnEvent, {
        currentPlayerTurn: game.currentPlayerTurn,
        currentRound: game.currentRound,
        votePhase: false,
      });
      await this.turnQueue.add(
        TURN_TIMER_JOB,
        { gameId },
        {
          jobId: `turn-${game._id.toString()}-${game.currentPlayerTurn.toString()}`,
          delay: timerMs,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }
  }
}
