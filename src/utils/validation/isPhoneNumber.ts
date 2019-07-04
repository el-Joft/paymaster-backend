import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isEmail, isPhoneNumber } from '../helper';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsPhoneNumberOrEmail implements ValidatorConstraintInterface {
  public defaultMessage(): string {
    return 'isPhoneNumberOrEmail is neither a phone number nor an Email';
  }
  public validate(identifier: string): boolean {
    return isPhoneNumber(identifier) || isEmail(identifier);
  }
}
