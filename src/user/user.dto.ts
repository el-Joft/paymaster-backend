import { ApiModelProperty } from '@nestjs/swagger';
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
  @ApiModelProperty()
  public email: string;

  @IsNotEmpty({ message: 'Mobile Number cannot be empty' })
  @Validate(IsPhoneNumber)
  @ApiModelProperty()
  public mobileNumber: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Validate(CheckPasswordStrength)
  @Length(1, 255)
  @ApiModelProperty()
  public password: string;
}

export class CreateRoleDTO {
  @IsNotEmpty()
  @Length(1, 255)
  @ApiModelProperty()
  public name: string;
}

export class UserRO {
  public token?: string;
  public user: Promise<User>;
}

export class LoginUserDTO {
  @IsNotEmpty({ message: 'Enter your password' })
  @ApiModelProperty()
  public password: string;
  @Length(1, 255)
  @Validate(IsPhoneNumberOrEmail)
  @ApiModelProperty()
  @IsNotEmpty({ message: 'Enter your Email ID or Mobile Number' })
  public phoneNumberOrEmail: string;
}
