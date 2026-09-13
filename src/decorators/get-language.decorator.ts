import { createParamDecorator } from '@nestjs/common';
import { pickLanguage } from 'src/utils/helpers.utils';

export const GetLanguage = createParamDecorator((data, req) => {
  const request = req.switchToHttp().getRequest();
  return pickLanguage(request.headers['accept-language']);
});
