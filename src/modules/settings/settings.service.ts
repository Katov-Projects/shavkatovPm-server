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
    const updateData: Record<string, unknown> = {};

    Object.keys(payload).forEach((key) => {
      const value = payload[key as keyof UpdateSettingsDto];
      if (value !== undefined && value !== null) {
        updateData[key] = value;
      }
    });

    const settings = await this.settingsModel.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        upsert: true,
        new: true,
        runValidators: true,
      },
    );

    return { message: 'success', data: settings };
  }
}
