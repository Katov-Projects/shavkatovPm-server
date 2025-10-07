import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type StatisticsDocument = Statistics & Document;

@Schema({ _id: false, versionKey: false })
class TrafficSourceStats {
  @Prop({ type: [SchemaTypes.String], default: [] })
  uniqueViews: string[];

  @Prop({type: SchemaTypes.Number, default: 0})
  uniqueCount: number;

  @Prop({ type: SchemaTypes.Number, default: 0 })
  multiViews: number;

  @Prop({ type: SchemaTypes.Number, default: 0 })
  avgTime: number;

  @Prop({ type: SchemaTypes.Number, default: 0 })
  bounceRate: number;
}

const TrafficSourceStatsSchema =
  SchemaFactory.createForClass(TrafficSourceStats);

@Schema({ collection: 'daily-statistics', timestamps: true, versionKey: false })
export class Statistics {
  @Prop({ type: SchemaTypes.String, required: true })
  name: string;

  @Prop({
    type: Map,
    of: TrafficSourceStatsSchema,
    default: () => ({
      google: { uniqueViews: [], multiViews: 0, avgTime: 0, bounceRate: 0 },
      yandex: { uniqueViews: [], multiViews: 0, avgTime: 0, bounceRate: 0 },
      direct: { uniqueViews: [], multiViews: 0, avgTime: 0, bounceRate: 0 },
      telegram: { uniqueViews: [], multiViews: 0, avgTime: 0, bounceRate: 0 },
      instagram: { uniqueViews: [], multiViews: 0, avgTime: 0, bounceRate: 0 },
      other: { uniqueViews: [], multiViews: 0, avgTime: 0, bounceRate: 0 },
    }),
  })
  trafficSources: Map<string, TrafficSourceStats>;
  @Prop({
    type: SchemaTypes.String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  })
  periodType: 'daily' | 'weekly' | 'monthly';

  @Prop({ type: SchemaTypes.Date, required: true })
  date: Date;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
