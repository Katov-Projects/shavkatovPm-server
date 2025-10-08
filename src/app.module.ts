import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { TelegrafModule } from 'nestjs-telegraf';
import { AuthModule, BlogModule, BotModule, ProjectModule, StatsModule } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { CheckAuthGuard } from './guardes';
import { CategoryModule } from './modules/category/category.module';

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

    AuthModule,

    BlogModule,

    ProjectModule,

    CategoryModule,

    StatsModule,

  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: CheckAuthGuard,
    },
  ],
})
export class AppModule {}
