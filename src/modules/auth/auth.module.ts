import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtHelper } from '../../helpers';
import { Auth, AuthSchema } from './model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
      secret: process.env.ACCESSTOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.ACCESSTOKEN_SECRET_TIME as any },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtHelper],
  exports: [JwtHelper],
})
export class AuthModule {}
