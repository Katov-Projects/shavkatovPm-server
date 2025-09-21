import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_URL: Joi.string().required(),
      }),
    }),

    TelegrafModule.forRoot({
      token: process.env.BOT_SECRET_TOKEN as string,
    }),

    MongooseModule.forRoot(process.env.DB_URL as string),

    BotModule,
  ],
})
export class AppModule {}
