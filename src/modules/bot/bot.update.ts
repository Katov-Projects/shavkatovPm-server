import { Ctx, Update } from 'nestjs-telegraf';
import { SendMessageDto } from './dtos';
import { Context, Telegraf } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(private readonly bot: Telegraf) {}

  async sendMessage(payload: SendMessageDto) {

    try {
      const AdminTelId = parseInt(process.env.ADMIN_TELEGRAM_ID as string);
      await this.bot.telegram.sendMessage(
        AdminTelId,
        `
        ShavkatovPm Xabar 🫵

        First name: ${payload.firstName || 'N/A'}
        Last Name: ${payload.lastName || 'N/A'}
        Telegram Username: ${payload.telegram || 'N/A'}
        Email: ${payload.email || 'N/A'}
        Phone number: ${payload.phone || 'N/A'}
        Subject: ${payload.subject || 'N/A'}
        Message: ${payload.message || 'N/A'}
        `,
      );
    } catch (error) {
      console.log(error, "Adminga habar yuborishda xatolik");
    }

    return {
      message: 'success',
    };
  }
}
