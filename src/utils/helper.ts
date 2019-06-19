import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';

dotenv.config();
const nodeEnv: string = process.env.EMAIL_SECRET as string;
export function generateEmailToken(email: string): string {
  return jsonwebtoken.sign({ email }, nodeEnv, {
    expiresIn: '2d',
  });
}

export function decodeToken(token: string): any {
  return jsonwebtoken.verify(token, nodeEnv);
}

export function generateAuthToken(payload: any): string {
  return jsonwebtoken.sign(payload, nodeEnv, {
    expiresIn: '7d',
  });
}

export const isEmail = (email: string): boolean =>
  /^\w{2,}@\w{2,}\.\w{2,}$/.test(email);

export const isPhoneNumber = (number: string): boolean =>
  /^[0]\d{7,15}$/.test(number);
