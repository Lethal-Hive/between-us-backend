import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { appEnv } from './configs/app.config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as express from 'express';
import * as morgan from 'morgan';
import * as requestIp from 'request-ip';
import * as responseTime from 'response-time';
import swaggerInit from './swagger';
import { AllExceptionsFilterDevelopment } from './common/errors/developmentFilters.errors';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilterProduction } from './common/errors/productionFilters.errors';
import { useContainer } from 'class-validator';
import { APP_ENVIRONMENT } from './constants/app.constants';
import * as dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

const logger = new Logger('Bootstrap');

function DEVELOPMENT_MODE(app: NestExpressApplication, config: appEnv) {
  logger.verbose('Server is running in development mode');
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': [
            "'self'",
            'https://cdn.jsdelivr.net',
            'https://cdn.jsdelivr.net/npm',
          ],
          'style-src': [
            "'self'",
            'https://cdn.jsdelivr.net',
            'https://cdn.jsdelivr.net/npm',
            "'unsafe-inline'",
          ],
        },
      },
    }),
  );
  app.use(responseTime());

  app.use((req, res, next) => {
    if (req.path === '/v1/auth/webhook/clerk') {
      express.raw({ type: '*/*' })(req, res, (err) => {
        if (err) return next(err);
        (req as any).rawBody = req.body;
        next();
      });
    } else {
      express.json()(req, res, () => {
        express.urlencoded({ extended: true })(req, res, next);
      });
    }
  });

  app.enableCors({ origin: true, credentials: true });
  app.use(morgan(':method :url :status :response-time ms - :date[web]'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  swaggerInit(app, config);
  app.useGlobalFilters(app.get(AllExceptionsFilterDevelopment));
}
function PRODUCTION_MODE(app: NestExpressApplication, config: appEnv) {
  logger.verbose('Server is running in production mode');
  app.use(helmet());

  app.use((req, res, next) => {
    if (req.path === '/v1/auth/webhook/clerk') {
      express.raw({ type: '*/*' })(req, res, (err) => {
        if (err) return next(err);
        (req as any).rawBody = req.body;
        next();
      });
    } else {
      express.json()(req, res, () => {
        express.urlencoded({ extended: true, limit: '200mb' })(req, res, next);
      });
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  config.cors.enabled
    ? app.enableCors({
        origin: function (origin, callback) {
          if (!origin || config.cors.origins.indexOf(origin) !== -1) {
            callback(null, origin);
          } else callback(new Error('Not allowed by CORS'));
        },

        credentials: true,
      })
    : app.enableCors({ origin: true, credentials: true });

  app.use(
    morgan(':method :url :status :response-time ms - :date[web]', {
      skip: function (req, res) {
        return res.statusCode < 500;
      },
    }),
  );
  app.useGlobalFilters(app.get(AllExceptionsFilterProduction));
}

async function bootstrap() {
  const app = (await NestFactory.create(AppModule, {
    bodyParser: false,
  })) as NestExpressApplication;

  app.use(requestIp.mw());
  app.set('trust proxy', 1);
  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');
  process.env.NODE_ENV = appConfig.env;
  process.env.TZ = appConfig.timezone;

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appConfig.urlVersion.version,
    prefix: appConfig.urlVersion.prefix,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  process.env.NODE_ENV == APP_ENVIRONMENT.PRODUCTION
    ? PRODUCTION_MODE(app, appConfig)
    : DEVELOPMENT_MODE(app, appConfig);

  logger.verbose('Running on port: ' + appConfig.port);
  await app.listen(appConfig.port);
}
void bootstrap();
