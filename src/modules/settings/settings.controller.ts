import { Body, Controller, Get, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dtos';
import { Protected } from '../../decoratores';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('all')
  @Protected(false)
  async getSettings() {
    return await this.service.getSettings();
  }

  @Patch('update')
  @Protected(false)
  async updateSettings(@Body() body: UpdateSettingsDto) {
    return await this.service.updateSettings(body);
  }
}
