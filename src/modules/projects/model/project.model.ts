import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true, collection: 'project', versionKey: false })
export class Project {
  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  subtitle: string;

  @Prop({ type: SchemaTypes.String, required: true })
  maqsad: string;

  @Prop({ type: SchemaTypes.String, required: true })
  yondashuv: string;

  @Prop({ type: [SchemaTypes.String], required: true })
  vositalar: string[];

  @Prop({ type: SchemaTypes.String, required: true })
  url: string;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  isArchive: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
