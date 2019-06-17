import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  NotificationService,
} from '../shared/notification/notification.service';
import {
  decodeToken,
  generateAuthToken,
  generateEmailToken,
} from '../utils/helper';

import { Role } from './role.entity';
import { CreateRoleDTO, CreateUserDTO, UserRO } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private notificationService: NotificationService,
  ) {}

  public async createRole(name: CreateRoleDTO): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (role) {
      throw new HttpException('Role already exist', HttpStatus.CONFLICT);
    }

    return this.roleRepository.create({ ...name }).save();
  }

  public async getRoleByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name },
    });
    if (!role) {
      const messages = {
        message: 'Role does not exist',
      };
      throw new ConflictException({
        messages,
        status: HttpStatus.CONFLICT,
      });
    }

    return role;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      const messages = {
        message: 'User does not exist',
      };
      throw new ConflictException({
        messages,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }

  public async register(userDTO: CreateUserDTO): Promise<UserRO> {
    const { email, mobileNumber, password }: CreateUserDTO = userDTO;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.mobileNumber = :mobileNumber', {
        email,
        mobileNumber,
      })
      .getMany();
    let messages: { email?: string; mobileNumber?: string } = {};
    if (user.length) {
      switch (user.length) {
        case 1:
          if (user[0].mobileNumber === mobileNumber) {
            messages.mobileNumber = 'Phone Number already exist';
          }
          if (user[0].email === email) {
            messages.email = 'Email already exist';
          }
          break;
        case 2:
          messages = {
            email: 'Email already exist',
            mobileNumber: 'Phone Number already exist',
          };
          break;
        default:
          break;
      }
      throw new ConflictException({
        messages,
        status: HttpStatus.CONFLICT,
      });
    }
    const BASEURL: string = process.env.BASEURL as string;
    const token = generateEmailToken(email);

    const role = await this.getRoleByName('customer');
    const newUser = await this.userRepository.create({
      email,
      mobileNumber,
      password,
    });
    newUser.role = role;
    newUser.token = token;
    await newUser.save();
    const message = {
      message: 'Account Created Successfully',
      status: HttpStatus.CREATED,
    };
    const link = `${BASEURL}/auth/verification?token=${token}`;

    const mail = await this.notificationService.verificationEmail(
      email,
      link,
    );
    Logger.log(mail);

    return newUser.toResponseObject(false, message);
  }

  public async verifyEmail(token: string): Promise<UserRO> {
    const decode = decodeToken(token);
    const user = await this.getUserByEmail(decode.email);
    if (user.token !== token) {
      const messages = {
        email: 'Invalid verification token',
      };
      throw new ConflictException({
        messages,
        status: HttpStatus.CONFLICT,
      });
    }
    user.token  = generateAuthToken(user.mobileNumber, user.email);
    user.isEmailVerified = true;
    const updateUser = await user.save();
    const message = {
      message: 'Your Account has been Verified',
      status: HttpStatus.ACCEPTED,
    };

    return updateUser.toResponseObject(true, message);
  }
}
