import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';

export class DatabaseQuery {
  public async getObjectOr404(
    repository: any, field: string, data: string): Promise<any> {
    const db = await repository.findOne({ where: { [field]: data } });
    if (!db) {
      const messages = {
        name: `${data} does not exist`,
      };
      throw new NotFoundException({
        messages,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return db;
  }

  public async getObjectOr409(
    repository: any,
    field: string, data: string): Promise<any> {
    const db = await repository.findOne({ where: { [field]: data } });
    if (db) {
      const messages = {
        name: `${data} Already exist`,
      };
      throw new ConflictException({
        messages,
        status: HttpStatus.CONFLICT,
      });
    }

    return db;
  }
}
