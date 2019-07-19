import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryServicesDTO {
  @IsNotEmpty()
  @Length(1, 255)
  @ApiModelProperty()
  public name: string;
}

export class CreateServicesDTO {

  @IsNotEmpty()
  @Length(1, 255)
  @ApiModelProperty()
  public categoryId: string;
  @IsNotEmpty()
  @Length(1, 255)
  @ApiModelProperty()
  public name: string;
}
