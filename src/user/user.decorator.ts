import { createParamDecorator } from '@nestjs/common';

export const USER = createParamDecorator((data: any, req: any) => {
  return data ? req.user[data] : req.user;
});
