import { Module } from "@nestjs/common";
import { BotController } from "./bot.controller";
import { BotUpdate } from "./bot.update";
import { Telegraf } from "telegraf";
import { ConfigService } from "@nestjs/config";


@Module({
  controllers: [BotController],
  providers: [BotUpdate, 
    {
      provide: Telegraf,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>('BOT_SECRET_TOKEN');
        return new Telegraf(token as string);
      },
    },
  ],

})

export class BotModule {}

