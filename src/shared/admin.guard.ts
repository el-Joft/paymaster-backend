import {
  CanActivate,
  ExecutionContext,
  Injectable, UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  public constructor() {}
  public canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (user && user.role === 'admin') {
      return true;
    }
    throw new UnauthorizedException('Unauthorized Access.');
  }
}
