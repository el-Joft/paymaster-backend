import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { getConnection, Repository } from 'typeorm';

import {
  ROLE_REPOSITORY_TOKEN,
  SOCIALAUTH_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '../common/config/database.tokens.constants';
import { NotificationService } from '../shared/notification/notification.service';
import {
  decodeToken,
  generateAuthToken,
  generateEmailToken,
  isEmail,
} from '../utils/helper';

import { Role } from './role.entity';
import { SocialAuth } from './SocialAuth.entity';
import { CreateRoleDTO, CreateUserDTO, LoginUserDTO, UserRO } from './user.dto';
import { User } from './user.entity';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class UserService {
  public constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private userRepository: Repository<User>,
    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: Repository<Role>,
    @Inject(SOCIALAUTH_REPOSITORY_TOKEN)
    private readonly socialAuthRepository: Repository<SocialAuth>,
    private notificationService: NotificationService,
  ) {}

  public async createRole(name: CreateRoleDTO): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { name } });
    if (role) {
      throw new HttpException('Role already exist', HttpStatus.CONFLICT);
    }

    return this.roleRepository.create({ ...name }).save();
  }

  public async findById(id: any): Promise<any> {
    try {
      return await this.roleRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  public async findByProviderClientId(providerClientId: any): Promise<any> {
    try {
      return await this.socialAuthRepository
        .createQueryBuilder('social_auth')
        .where('social_auth.providerClientId = :providerClientId', {
          providerClientId,
        })
        .getOne();
    } catch (error) {
      throw error;
    }
  }

  public findOneByThirdPartyId(thirdPartyId: any, provider: any): any {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.thirdPartyId = :thirdPartyId OR user.provider = :provider', {
        provider,
        thirdPartyId,
      })
      .getOne();
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

  public async getUserById(id: string): Promise<User | undefined> {
    try {
      return this.userRepository.findOne({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException({
        messages: e.message,
        status: HttpStatus.NOT_FOUND,
      });
    }
  }

  public async login(userDTO: LoginUserDTO): Promise<Object> {
    const { phoneNumberOrEmail, password }: LoginUserDTO = userDTO;

    const queryString = isEmail(phoneNumberOrEmail)
      ? 'user.email = :email'
      : 'user.mobileNumber = :mobileNumber';

    const queryObj = isEmail(phoneNumberOrEmail)
      ? { email: phoneNumberOrEmail }
      : { mobileNumber: phoneNumberOrEmail };
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where(queryString, queryObj)
      .getOne();
    if (!user) {
      throw new BadRequestException({
        messages: {
          error: 'Invalid credentials',
        },
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new BadRequestException({
        messages: {
          error: 'Invalid credentials',
        },
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const payload: Object = {
      email: user.email,
      id: user.id,
      mobileNumber: user.mobileNumber,
    };
    const token = generateAuthToken(payload);
    user.token = token;
    await user.save();

    const message = {
      message: 'Login Successfully',
      status: HttpStatus.OK,
    };

    return { token, message };
  }

  public async register(userDTO: CreateUserDTO): Promise<UserRO> {
    const {
      email,
      mobileNumber,
      password,
      firstName,
      lastName,
    }: CreateUserDTO = userDTO;

    await this.validateUser({ email, mobileNumber });
    const BASEURL: string = process.env.BASEURL as string;
    const token = generateEmailToken(email);

    const role = await this.getRoleByName('customer');
    const newUser = this.userRepository.create({
      email,
      firstName,
      lastName,
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
      firstName,
    );
    Logger.log(mail);

    return newUser.toResponseObject(false, message);
  }

  public async update(userId: string, data: Partial<User>): Promise<any> {
    const id = userId;
    try {
      let user = await this.userRepository.findOne({
        where: { id },
      });
      if (user) {
        await getConnection()
          .createQueryBuilder()
          .update(User)
          .set({
            address: data.address || user.address,
            businessName: data.businessName || user.businessName,
            cac: data.cac || user.cac,
            designation: data.designation || user.designation,
            firstName: data.firstName || user.firstName,
            landmark: data.landmark || user.landmark,
            lastName: data.lastName || user.lastName,
            lga: data.lga || user.lga,
            state: data.state || user.state,
            telephone: data.telephone || user.telephone,
            website: data.website || user.website,
          })
          .where('id = :id', { id })
          .execute();

        user = await this.userRepository.findOne({
          where: { id },
        });
        const message = {
          message: 'Profile Updated Successfully',
          status: HttpStatus.OK,
        };

        return { user, message };
      }

      return {
        messages: {
          error: 'Unauthorized, User not found',
        },
        status: HttpStatus.UNAUTHORIZED,
      };
    } catch {
      throw new BadRequestException({
        messages: {
          error: 'Profile was not updated. Try again',
        },
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  public async validateUser(data: Object): Promise<any> {
    const { email, mobileNumber }: any = data;
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
    const payload: Object = {
      email: user.email,
      id: user.id,
      mobileNumber: user.mobileNumber,
    };
    user.token = generateAuthToken(payload);
    user.isEmailVerified = true;
    const updateUser = await user.save();
    const message = {
      message: 'Your Account has been Verified',
      status: HttpStatus.ACCEPTED,
    };

    return updateUser.toResponseObject(true, message);
  }
}
