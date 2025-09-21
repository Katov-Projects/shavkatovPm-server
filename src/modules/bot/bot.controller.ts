import { Body, Controller, Get, Post } from "@nestjs/common";
import { BotUpdate } from "./bot.update";
import { SendMessageDto } from "./dtos";
import { Ctx } from "nestjs-telegraf";
import { Context } from "telegraf";



@Controller("bot")
export class BotController {
  constructor(private readonly bot: BotUpdate){};

  @Post()
  async sendMessage(@Body() body: SendMessageDto,){
    return await this.bot.sendMessage(body);
  }
}