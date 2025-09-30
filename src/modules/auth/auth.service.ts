import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './model';
import { Model } from 'mongoose';
import { AuthUpdateDto, AuthLoginDto } from './dtos';
import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { JwtHelper } from 'src/helpers';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

@Injectable()
export class AuthService implements OnModuleInit {
  async onModuleInit() {
    this.seedFile();
  }

  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private readonly jwt: JwtHelper,
  ) {}

  async update(payload: AuthUpdateDto, req: Request & { adminId: string }, res: Response) {
    const adminId = req.adminId;

    const hashPassword = await bcrypt.hash(payload.password, 10);

    const data = await this.authModel.findByIdAndUpdate(adminId, {
      login: payload.login,
      password: hashPassword,
    })

    if(!data){
      throw new NotFoundException("Admin Not Found");
    }

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });


    return res.json({ message: 'success' });
  }

  async login(payload: AuthLoginDto, res: Response) {
    const foundUser = await this.authModel.findOne({ login: payload.login });

    if (!foundUser) {
      throw new NotFoundException('Admin Not Found');
    }

    const checkPass = await bcrypt.compare(
      payload.password,
      foundUser.password,
    );

    if (!checkPass) {
      throw new BadRequestException('Error Password');
    }

    const tokenSecretKey = process.env.ACCESSTOKEN_SECRET_KEY as string;
    const tokenSecretTime = process.env.ACCESSTOKEN_SECRET_TIME as string;

    const token = await this.jwt.generateToken(
      { id: foundUser.id },
      tokenSecretKey,
      tokenSecretTime,
    );

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return {
      message: 'success',
    };
  }

  async seedFile() {
    try {
      const admin = await this.authModel.findOne({ login: 'admin' });

      if (!admin) {
        const password = process.env.ADMIN_PAROL || '12345';
        const hashPassword = await bcrypt.hash(password, 10);

        await this.authModel.create({
          login: 'admin',
          password: hashPassword,
        });
      }
      console.log('default admin created ☑️');
    } catch (error) {
      console.error(error, 'default user error ❌');
    }
  }
}
