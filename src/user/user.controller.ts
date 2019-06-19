import { ApiUseTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import passport = require('passport');

import { CreateUserDTO, LoginUserDTO } from './user.dto';
import { UserService } from './user.service';

@ApiUseTags('authentication')
@Controller('auth')
export class UserController {
  public constructor(private userService: UserService) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  public googleLogin(): any {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  public googleLoginCallback(@Req() req: any, @Res() res: any): any {
    // handles the Google OAuth2 callback
    passport.authenticate('google');
    const jwt: string = req.user.token;
    if (jwt) {
      res.redirect(`http://localhost:4200/login/succes/ + ${jwt}`);
    } else {
      res.redirect('http://localhost:4200/login/failure');
    }
  }
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
