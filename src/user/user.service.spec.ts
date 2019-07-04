import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockedUser: any = {
    user : {
      email: 'ottimothy@gmail.com',
      firstName: 'FirsName',
      lastName: 'LastName',
      mobileNumber: '+23408234567',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should match the registered user', async () => {
    const userData = {
      email: 'ottimothy@gmail.com',
      firstName: 'FirsName',
      lastName : 'LastName',
      mobileNumber: '+23408234567',
      password : 'Password!123',
    };
    expect(await service.register(userData)).toEqual(mockedUser);
  });
});
