import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwt: JwtService) {}

  async generateToken(
    payload: { id: string },
    secretKey: string,
    secretTime: string,
  ) {
    const token = await this.jwt.signAsync(payload, {
      secret: secretKey,
      expiresIn: secretTime,
    });

    return token;
  }

  async verifyToken(token: string, sekretKey: string) {
    try {
      const openToken = await this.jwt.verifyAsync(token, {
        secret: sekretKey,
      });
      return openToken;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequestException('token_not_found');
      }

      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('token time out');
      }

      throw new InternalServerErrorException('server error');
    }
  }
}
