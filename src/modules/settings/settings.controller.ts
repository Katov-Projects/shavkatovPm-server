import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dtos';
import { Protected } from 'src/decoratores';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('all')
  @Protected(false)
  async getSettings() {
    return await this.service.getSettings();
  }

  @Put('update')
  @Protected(true)
  async updateSettings(@Body() body: UpdateSettingsDto) {
    return await this.service.updateSettings(body);
  }
}
