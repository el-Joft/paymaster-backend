import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import dotenv from 'dotenv';
import { Strategy } from 'passport-google-oauth20';

import { UserService } from './user.service';

dotenv.config();
const GOOGLE_CLIENTID: string = process.env.GOOGLE_CLIENTID as string;
const GOOGLE_CLIENTSECRET: string = process.env.GOOGLE_CLIENTSECRET as string;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{

  public constructor(
    private readonly userService: UserService,
  ) {
    super({
      callbackURL : 'http://localhost:4000/api/v1/auth/google/callback',
      clientID : GOOGLE_CLIENTID,
      clientSecret: GOOGLE_CLIENTSECRET,
      passReqToCallback: true,
      scope: ['profile'],
    });
  }

  public async validate(
    // tslint:disable-next-line:variable-name
    _request: any,
    // tslint:disable-next-line:variable-name
    _accessToken: string,
    // tslint:disable-next-line:variable-name
    _refreshToken: string, profile: any, done: Function): Promise<any> {
    if (!profile.id) {
      done(null, null);
    }
    const oauthTokensAccesstoken = await this
      .userService.findByProviderClientId(profile.id);
    if (oauthTokensAccesstoken) {
      const user = await this.userService.findById(
          oauthTokensAccesstoken.user.id);
      if (user) {
        return done(null, user);
      }
    }
  }
}
