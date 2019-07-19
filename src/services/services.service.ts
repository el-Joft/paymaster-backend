import {
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';

import {
  SERVICES_REPOSITORY_TOKEN,
  SERVICESCATEGORY_REPOSITORY_TOKEN,
} from '../common/config/database.tokens.constants';
import { DatabaseQuery } from '../shared/database';

import { ServiceCategoryEntity } from './serviceCategory.entity';
import { CreateCategoryServicesDTO, CreateServicesDTO } from './services.dto';
import { ServicesEntity } from './services.entity';

@Injectable()
export class ServicesService {
  public constructor(
    @Inject(SERVICES_REPOSITORY_TOKEN)
    private readonly serviceRepository: Repository<ServicesEntity>,
    @Inject(SERVICESCATEGORY_REPOSITORY_TOKEN)
    private readonly categoryServiceRepository: Repository<ServiceCategoryEntity>,
    private databaseQuery: DatabaseQuery,
  ) {}

  public async createCategory(data: CreateCategoryServicesDTO): Promise<any> {
    await this.databaseQuery.getObjectOr409(
      this.categoryServiceRepository,
      'name',
      data.name);

    const category = await this.categoryServiceRepository.create({ ...data }).save();
    const message = {
      message: 'Service Category Created',
      status: HttpStatus.CREATED,
    };

    return {
      category,
      message,
    };
  }

  public async createService(data: CreateServicesDTO): Promise<any> {
    const { name }: CreateServicesDTO = data;
    await this.databaseQuery.getObjectOr409(
      this.serviceRepository,
      'name',
      data.name);

    const category  = await this.databaseQuery.getObjectOr404(
      this.categoryServiceRepository,
      'id',
      data.categoryId);

    const service =  this.serviceRepository.create({ name });
    service.serviceCategory = category;
    await service.save();

    const message = {
      message: 'Service Category Created',
      status: HttpStatus.CREATED,
    };

    return {
      message,
      service,
    };
  }

  public async listAllCategory(): Promise<any> {
    const categories = await this.categoryServiceRepository
      .createQueryBuilder('serviceCategory')
      .leftJoinAndSelect('serviceCategory.services', 'service')
      .getMany();

    const message = {
      message: 'All Categories',
      status: HttpStatus.OK,
    };

    return { message, categories };
  }

  public async listAllService(): Promise<any> {
    const services = await this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.serviceCategory', 'serviceCategory')
      .getMany();

    const message = {
      message: 'All Services',
      status: HttpStatus.OK,
    };

    return { message, services };
  }

  public async retrieveCategory(id: string): Promise<any> {
    await this.databaseQuery.getObjectOr404(
      this.categoryServiceRepository,
      'id', id);
    const categories = await this.categoryServiceRepository
      .createQueryBuilder('serviceCategory')
      .leftJoinAndSelect('serviceCategory.services', 'service')
      .where({ id })
      .getOne();

    const message = {
      message: 'All Categories',
      status: HttpStatus.OK,
    };

    return { message, categories };
  }

  public async retrieveService(id: string): Promise<any> {
    await this.databaseQuery.getObjectOr404(
      this.serviceRepository,
      'id', id);
    const service = await this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.serviceCategory', 'serviceCategory')
      .where({ id })
      .getOne();

    const message = {
      message: 'All Categories',
      status: HttpStatus.OK,
    };

    return { message, service };
  }

  public async updateCategory(id: any, data: Partial<CreateCategoryServicesDTO>): Promise<any> {
    await this.databaseQuery.getObjectOr404(
      this.categoryServiceRepository,
      'id', id);
    await this.categoryServiceRepository.update(
        { id }, data);
    const category = await this.databaseQuery.getObjectOr404(
      this.categoryServiceRepository,
      'id', id);
    const message = {
      message: 'Service Category Update',
      status: HttpStatus.OK,
    };

    return {
      category,
      message,
    };
  }

  public async updateService(id: any, data: Partial<CreateServicesDTO>): Promise<any> {
    const getService = await this.databaseQuery.getObjectOr404(
      this.serviceRepository,
      'id', id);
    let category;
    if (data.categoryId) {
      category  = await this.databaseQuery.getObjectOr404(
        this.categoryServiceRepository,
        'id',
        data.categoryId);
    }

    await getConnection()
      .createQueryBuilder()
      .update(ServicesEntity)
      .set({
        name: data.name || getService.name,
        serviceCategory: category || getService.serviceCategory,
      })
      .where('id = :id', { id })
      .execute();

    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    const message = {
      message: 'Service Update Successfully',
      status: HttpStatus.OK,
    };

    return {
      message,
      service,
    };
  }
}
