import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  Length, Matches,
  Validate,
} from 'class-validator';

import { IsPhoneNumberOrEmail } from '../utils/validation/isPhoneNumber';

import { User } from './user.entity';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Email cannot be Empty' })
  @IsEmail()
  @ApiModelProperty()
  public email: string;

  @IsNotEmpty({ message: 'First Name cannot be empty' })
  @IsAlpha({ message: 'First Name must contain only letters' })
  @ApiModelProperty()
  public firstName: string;

  @IsNotEmpty({ message: 'Last Name cannot be empty' })
  @IsAlpha({ message: 'Last Name must contain only letters' })
  @ApiModelProperty()
  public lastName: string;

  @IsNotEmpty({ message: 'Mobile Number cannot be empty' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone Number must be valid',
  })
  @ApiModelProperty()
  public mobileNumber: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Minimum eight characters, at least one letter,' +
      ' one number and one special character',
  })
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
