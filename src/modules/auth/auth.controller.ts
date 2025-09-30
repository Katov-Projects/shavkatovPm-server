import { Body, Controller, Get, Post, Put, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUpdateDto, AuthLoginDto } from "./dtos";
import { Protected } from "src/decoratores";
import { Request, Response } from "express";


@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @Protected(false)
  async login(
    @Body() body: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.login(body, res);
  }

  @Put('update')
  @Protected(true)
  async update(
    @Body() body: AuthUpdateDto,
    @Req() req: Request & { adminId: string },
    @Res() res: Response,
  ) {
    return await this.service.update(body, req, res);
  }

  @Get('token')
  @Protected(true)
  async checkToken() {
    return { message: 'success' };
  }
}