import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ collection: 'settings', timestamps: true, versionKey: false })
export class Settings {
  @Prop({
    type: SchemaTypes.String,
    enum: ['newest', 'oldest', 'mostViewed'],
    default: 'newest',
  })
  blogSortBy: string;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
