import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { CreateUserDTO, LoginUserDTO } from './user.dto';
import { UserService } from './user.service';

@ApiUseTags('authentication')
@Controller('auth')
export class UserController {
  public constructor(private userService: UserService) {}

  @Post('login')
  public login(@Body() data: LoginUserDTO): any {
    return this.userService.login(data);
  }
  @Post('register')
  public register(@Body() data: CreateUserDTO): any {
    return this.userService.register(data);
  }

  @Get('verification')
  public verifyToken(@Query('token') token: string): any {

    return this.userService.verifyEmail(token);
  }
}
