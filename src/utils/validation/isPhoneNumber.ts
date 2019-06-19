import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isEmail, isPhoneNumber } from '../helper';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsPhoneNumber implements ValidatorConstraintInterface {
  public defaultMessage(): string {
    return 'Phone Number must be valid';
  }
  public validate(phoneNumber: string): boolean {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(
      phoneNumber);
  }
}

@ValidatorConstraint({ name: 'customText', async: false })
export class CheckPasswordStrength implements ValidatorConstraintInterface {
  public defaultMessage(): string {
    return 'Minimum eight characters, at least one letter,' +
      ' one number and one special character';
  }
  public validate(password: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
      .test(password);
  }
}

@ValidatorConstraint({ name: 'customText', async: false })
export class IsPhoneNumberOrEmail implements ValidatorConstraintInterface {
  public defaultMessage(): string {
    return 'isPhoneNumberOrEmail is neither a phone number nor an Email';
  }
  public validate(identifier: string): boolean {
    return isPhoneNumber(identifier) || isEmail(identifier);
  }
}
