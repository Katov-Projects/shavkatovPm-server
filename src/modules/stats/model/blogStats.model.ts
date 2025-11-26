import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ collection: 'blog-stats', timestamps: true, versionKey: false })
export class BlogStats {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' })
  blogId: string;

  @Prop({ required: true, unique: true })
  socketId: string;

  @Prop({ required: true })
  enterTime: Date;
}

export type BlogStatsDocument = BlogStats & Document;
export const BlogStatsSchema = SchemaFactory.createForClass(BlogStats);
