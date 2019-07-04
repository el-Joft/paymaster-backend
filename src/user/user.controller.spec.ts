import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserRO } from './user.dto';
import { UserService } from './user.service';

describe('User Controller', () => {
  let userController: UserController;
  // let userService: UserService;

  const mockedUser: any = {
    user : {
      email: 'ottimothy@gmail.com',
      firstName: 'FirsName',
      lastName: 'LastName',
      mobileNumber: '+23408234567',
    },
  };

  class UserServiceMock {
    public register(): Promise<UserRO> {

      return mockedUser;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers : [UserController],
      providers: [{
        provide: UserService,
        useClass: UserServiceMock,
      }],
    }).compile();

    // userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
  });

  describe('create user', () => {
    it('should register a user', async () => {
      // jest.spyOn(userService, 'register').mockImplementation(
      //   (): any => mockedUser);
      const userData = {
        email: 'ottimothy@gmail.com',
        firstName: 'FirsName',
        lastName : 'LastName',
        mobileNumber: '+23408234567',
        password : 'Password!123',
      };
      expect(await userController.register(userData)).toBe(mockedUser);
    });
  });
});
