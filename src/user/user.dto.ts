import {
  IsEmail,
  IsNotEmpty,
  Length,
  Validate,
} from 'class-validator';

import {
  CheckPasswordStrength,
  IsPhoneNumber, IsPhoneNumberOrEmail,
} from '../utils/validation/isPhoneNumber';

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
  public token?: string;
  public user: Promise<User>;
}

export class LoginUserDTO {
  @IsNotEmpty({ message: 'Enter your password' })
  public password: string;
  @Length(1, 255)
  @Validate(IsPhoneNumberOrEmail)
  @IsNotEmpty({ message: 'Enter your Email ID or Mobile Number' })
  public phoneNumberOrEmail: string;
}
