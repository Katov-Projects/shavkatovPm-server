import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtHelper } from '../helpers';
import { PROTECTED_KEY } from '../decoratores';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest<Request & { adminId: string }>();

    if (!isProtected) {
      return true;
    }

    const token = req.cookies['accessToken'];

    if (!token) {
      throw new BadRequestException('token not found');
    }

    const sekretTokenKey = process.env.ACCESSTOKEN_SECRET_KEY as string;
    const data = await this.jwtHelper.verifyToken(token, sekretTokenKey);

    req.adminId = data?.id;

    return true;
  }
}
