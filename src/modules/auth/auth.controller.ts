import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "./dtos";
import { Protected } from "src/decoratores";
import { Response } from "express";


@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService){};


  @Post('login')
  @Protected(false)
  async login (@Body() body: AuthLoginDto, @Res({passthrough: true}) res: Response){
    return this.service.login(body, res);
  }

  @Get('token')
  @Protected(true)
  async checkToken (){
    return {message: "success"}
  }
}