import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export enum TrafficSource {
  GOOGLE = 'google',
  YANDEX = 'yandex',
  DIRECT = 'direct',
  TELEGRAM = 'telegram',
  INSTAGRAM = 'instagram',
  OTHER = 'other',
}

@Schema({ collection: 'userstats', timestamps: true, versionKey: false })
export class UserStats {
  @Prop({ required: true, unique: true })
  socketId: string;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  enterTime: Date;

  @Prop({
    type: SchemaTypes.String,
    required: true,
    enum: Object.values(TrafficSource),
  })
  traffic: string;
}

export type UserStatsDocument = UserStats & Document;
export const UserStatsSchema = SchemaFactory.createForClass(UserStats);
