import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';

import { AdminGuard } from '../shared/admin.guard';
import { AuthGuard } from '../shared/auth.guard';

import { CreateCategoryServicesDTO, CreateServicesDTO } from './services.dto';
import { ServicesService } from './services.service';

@ApiUseTags('services')
@Controller('service')
export class ServicesController {
  public constructor(private services: ServicesService) {}

  @Post('category')
  @UseGuards(new AuthGuard(), AdminGuard)
  public createCategory(@Body() data: CreateCategoryServicesDTO): any {
    return this.services.createCategory(data);

  }

  @Post()
  @UseGuards(new AuthGuard(), AdminGuard)
  public createService(@Body() data: CreateServicesDTO): any {
    return this.services.createService(data);
  }

  @Get('category')
  @UseGuards(new AuthGuard(), AdminGuard)
  public listAllCategory(): any {
    return this.services.listAllCategory();
  }

  @Get()
  @UseGuards(new AuthGuard(), AdminGuard)
  public listAllServices(): any {
    return this.services.listAllService();
  }

  @Get('category/:id')
  @UseGuards(new AuthGuard(), AdminGuard)
  public retrieveCategory(
    @Param('id') id: string,
  ): any {
    return this.services.retrieveCategory(id);
  }

  @Get(':id')
  @UseGuards(new AuthGuard(), AdminGuard)
  public retrieveService(
    @Param('id') id: string,
  ): any {
    return this.services.retrieveService(id);
  }

  @Put('category/:id')
  @UseGuards(new AuthGuard(), AdminGuard)
  public updateCategory(
    @Param('id') id: string,
    @Body() data: Partial<CreateCategoryServicesDTO>): any {
    return this.services.updateCategory(id, data);
  }

  @Put(':id')
  @UseGuards(new AuthGuard(), AdminGuard)
  public updateService(
    @Param('id') id: string,
    @Body() data: Partial<CreateServicesDTO>): any {
    return this.services.updateService(id, data);
  }
}
