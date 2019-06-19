import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateUserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  public constructor(private userService: UserService) {}
  @Post('register')
  public register(@Body() data: CreateUserDTO): any {
    return this.userService.register(data);
  }

  @Get('verification')
  public verifyToken(@Query('token') token: string): any {

    return this.userService.verifyEmail(token);
  }
}
