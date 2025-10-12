import { Module } from "@nestjs/common";
import { Model } from "mongoose";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtHelper } from "src/helpers";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth, AuthSchema } from "./model";
import { JwtModule } from "@nestjs/jwt";


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
export class AuthModule {};