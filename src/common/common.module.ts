import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configs from 'src/configs';
import { I18nModule } from './i18n/i18n.module';
import { CacheManagerModule } from './cache-manager/cache-manager.module';
import { AllExceptionsFilterDevelopment } from './errors/developmentFilters.errors';
import { AllExceptionsFilterProduction } from './errors/productionFilters.errors';
@Module({
  controllers: [],
  providers: [AllExceptionsFilterDevelopment, AllExceptionsFilterProduction],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      expandVariables: false,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    I18nModule,
    CacheManagerModule,
  ],
})
export class CommonModule {}
