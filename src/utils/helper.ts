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

export function generateAuthToken(mobileNumber: string, email: string): string {
  return jsonwebtoken.sign({ mobileNumber, email }, nodeEnv, {
    expiresIn: '7d',
  });
}
