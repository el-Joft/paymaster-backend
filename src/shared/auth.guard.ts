import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request) {
      if (!request.headers.authorization) {
        return false;
      }
      // the generated token is attached to the request object
      request.user = await this.validateToken(request.headers.authorization);

      return true;
    }

    return false;

  }

  public async validateToken(auth: string): Promise<Object> {
    // this checks the format of the token
    // bearer token
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
    }

    const token = auth.split(' ')[1];
    try {

      const nodeEnv: string = process.env.EMAIL_SECRET as string;
      return await jwt.verify(token, nodeEnv);

    } catch (err) {
      const message = `Token error:  ${(err.message || err.name)}`;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
