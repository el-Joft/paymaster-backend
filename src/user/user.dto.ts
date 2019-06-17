import {
  IsEmail,
  IsNotEmpty,
  Length,
  Validate,
} from 'class-validator';

import {
  CheckPasswordStrength,
  IsPhoneNumber } from '../utils/validation/isPhoneNumber';

import { User } from './user.entity';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Email cannot be Empty' })
  @IsEmail()
  public email: string;

  @IsNotEmpty({ message: 'Mobile Number cannot be empty' })
  @Validate(IsPhoneNumber)
  public mobileNumber: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Validate(CheckPasswordStrength)
  @Length(1, 255)
  public password: string;
}

export class CreateRoleDTO {
  @IsNotEmpty()
  @Length(1, 255)
  public name: string;
}

export class UserRO {
  public message: any;
  public token?: string;
  public user: Promise<User>;
}
