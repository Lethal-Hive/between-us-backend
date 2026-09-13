import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { I18nKey, I18nService } from '../i18n/i18n.service';
import { pickLanguage } from 'src/utils/helpers.utils';

@Catch()
@Injectable()
export class AllExceptionsFilterDevelopment implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const locale = pickLanguage(request.headers['accept-language']);

    const expMessage: string | undefined = exception.message;
    const httpStatus =
      exception instanceof HttpException
        ? {
            errorType: 'HttpException',
            statusCode: exception.getStatus(),
            response: exception.getResponse()['message'],
            data: exception.getResponse()['data'] || [],
          }
        : {
            errorType: 'Error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            response: expMessage || 'GENERAL.INTERNAL_SERVER_ERROR',
            data: [],
            log: null,
          };
    console.log(exception.stack);

    response.status(httpStatus.statusCode).json({
      errorType: httpStatus.errorType,
      statusCode: httpStatus.statusCode,
      type: exception.name,
      message:
        typeof httpStatus.response === 'string'
          ? this.i18n.translate(
              locale,
              httpStatus.response as I18nKey,
              ...httpStatus.data,
            )
          : httpStatus.response.map((message) =>
              this.i18n.translate(locale, message, ...httpStatus.data),
            ),
      devError: exception.stack?.split('\n').slice(0, 2),
    });
  }
}
