import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Settings, SettingsDocument } from './model';
import { Model } from 'mongoose';
import { UpdateSettingsDto } from './dtos';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  async getSettings() {
    const settings = await this.settingsModel.findOne();

    return { message: 'success', data: settings };
  }

  async updateSettings(payload: UpdateSettingsDto) {
    let settings = await this.settingsModel.findOne();

    if (!settings) {
      settings = await this.settingsModel.create({
        blogSortBy: payload.blogSortBy || 'newest',
      });
    } else {
      if (payload.blogSortBy) {
        settings.blogSortBy = payload.blogSortBy;
      }
      await settings.save();
    }

    return { message: 'success', data: settings };
  }
}
