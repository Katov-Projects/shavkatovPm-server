import { Ctx, Update } from 'nestjs-telegraf';
import { SendMessageDto } from './dtos';
import { Context, Telegraf } from 'telegraf';

@Update()
export class BotUpdate {
  constructor(private readonly bot: Telegraf) {}

  async sendMessage(payload: SendMessageDto) {
    try {
      const AdminTelId = parseInt(process.env.ADMIN_TELEGRAM_ID as string);

      const escapeHtml = (str?: string) =>
        (str ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

      const text = `
        <b>📩 Yangi ariza!</b>

        <b>Ism:</b> ${escapeHtml(payload.firstName) || 'N/A'}
        <b>Familiya:</b> ${escapeHtml(payload.lastName) || 'N/A'}
        <b>Username:</b> ${escapeHtml(payload.telegram) || 'N/A'}
        <b>Email:</b> ${escapeHtml(payload.email) || 'N/A'}
        <b>Telefon:</b> ${escapeHtml(payload.phone) || 'N/A'}
        
        <b>Mavzu:</b> ${escapeHtml(payload.subject) || 'N/A'}

        <b>Xabar:</b> ${escapeHtml(payload.message) || 'N/A'}
      `.replace(/^[ \t]+/gm, '');

      await this.bot.telegram.sendMessage(AdminTelId, text, {parse_mode: "HTML"});
    } catch (error) {
      console.log(error, 'Adminga habar yuborishda xatolik');
    }

    return {
      message: 'success',
    };
  }
}
