import { ApiModelProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty, IsOptional, IsString,
  Length, Matches,
} from 'class-validator';

export class CreateAgentDTO {

  @IsNotEmpty({ message: '' })
  @ApiModelProperty()
  public address: string;

  @IsNotEmpty({ message: 'Business Name cannot be empty' })
  @ApiModelProperty()
  public businessName: string;

  @ApiModelProperty()
  @IsOptional()
  public cac: string;

  @IsNotEmpty({ message: 'State your designation' })
  @ApiModelProperty()
  public designation: string;

  @IsNotEmpty({ message: 'Email cannot be Empty' })
  @IsEmail()
  @ApiModelProperty()
  public email: string;

  @IsNotEmpty({ message: 'Provide a landmark' })
  @ApiModelProperty()
  public landmark: string;

  @IsNotEmpty({ message: 'Provide your Local Government Area' })
  @ApiModelProperty()
  public lga: string;

  @IsNotEmpty({ message: 'Mobile Number cannot be empty' })
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Phone Number must be valid',
  })
  @ApiModelProperty()
  public mobileNumber: string;

  @IsNotEmpty({ message: 'Specify if you have a Business outlet' })
  @ApiModelProperty()
  public outlet: boolean;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Minimum eight characters, at least one letter,' +
      ' one number and one special character',
  })
  @Length(1, 255)
  @ApiModelProperty()
  public password: string;

  @IsNotEmpty({ message: 'State cannot be empty' })
  @ApiModelProperty()
  public state: string;

  @IsOptional()
  @ApiModelProperty()
  public telephone?: string;

  @IsNotEmpty({ message: 'State either true or false' })
  @ApiModelProperty()
  public tradingCapital: boolean;

  @IsOptional()
  @ApiModelProperty()
  public website: string;

}

export class UpdateAgentStatus {
  @IsNotEmpty()
  @IsString()
  public agentId: string;
  @IsBoolean()
  public status: boolean;
}
