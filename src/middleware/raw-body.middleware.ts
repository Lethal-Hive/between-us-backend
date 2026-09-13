import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const data: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      data.push(chunk);
    });

    req.on('end', () => {
      (req as any).rawBody = Buffer.concat(data);
      next();
    });
  }
}
