import { createParamDecorator } from '@nestjs/common';
export const GetCfCountry = createParamDecorator((data, req) => {
  const request = req.switchToHttp().getRequest();
  return request.headers['cf-ipcountry'] || 'EG';
});
