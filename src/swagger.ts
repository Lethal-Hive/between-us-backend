import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger } from '@nestjs/common';

import { SwaggerThemes } from './swagger-themes';
import { apiReference } from '@scalar/nestjs-api-reference';
import { appEnv } from './configs/app.config';

// eslint-disable-next-line @typescript-eslint/no-require-imports

export default function (app: INestApplication, config: appEnv) {
  const logger = new Logger();
  const documentBuild = new DocumentBuilder()
    .setTitle(config.swagger.name)
    .setDescription(
      `Section for describe whole APIs
      \nSwagger JSON: ${config.swagger.route}/json
      \nSwagger YAML: ${config.swagger.route}/yaml`,
    )
    .setVersion(config.swagger.version)
    .addServer('/')
    .addServer(config.swagger.secondServer)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, documentBuild, {
    ...(config.swagger.useDocumentation !== 'SCALAR' && {
      deepScanRoutes: true,
      autoTagControllers: false,
    }),
  });
  const fns = [config.swagger.route];

  if (config.swagger.useDocumentation === 'SCALAR') {
    fns.push(
      apiReference({
        spec: {
          content: document,
        },
      }) as any,
    );
  }

  app.use(...fns);

  if (config.swagger.useDocumentation !== 'SCALAR') {
    SwaggerModule.setup(config.swagger.route, app, document, {
      jsonDocumentUrl: `${config.swagger.route}/json`,
      yamlDocumentUrl: `${config.swagger.route}/yaml`,
      explorer: false,
      customSiteTitle: config.swagger.tabName,
      customCss: SwaggerThemes.DarkThemeV2(),
      // customfavIcon: '../public/nxt.svg',
      swaggerOptions: {
        cache: false,
        docExpansion: 'none',
        persistAuthorization: true,
        displayOperationId: true,
        // operationsSorter: 'method',
        tagsSorter: function (a, b) {
          const numberA = a.match(/\d+/)[0] ?? '0';
          const numberB = b.match(/\d+/)[0] ?? '0';

          return parseInt(numberA) - parseInt(numberB);
        },
        tryItOutEnabled: true,
        filter: true,

        deepLinking: true,
      },
    });
  }

  logger.log(`==========================================================`);
  logger.log(
    `Docs will serve on ${config.swagger.route}\nSwagger JSON: ${config.swagger.route}/json\nSwagger YAML: ${config.swagger.route}/yaml`,
    'NestApplication',
  );
  logger.log(`==========================================================`);
}
