import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
} from '@nestjs/common';
import { verify as jwtVerify } from 'jsonwebtoken';

@Injectable()
export class MyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.header('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new ConflictException('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    const payload: any = jwtVerify(token, 'some-secret-key');
    const id = payload.id;
    if (typeof id !== 'number') {
      throw new ConflictException('Необходима авторизация');
    }
    request.user = id;
    return true;
  }
}
