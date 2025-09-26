import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, SchemaTypes } from "mongoose";


export type BlogDocument = Blog & Document;

@Schema({ _id: false, timestamps: false, versionKey: false })
class Section {
  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  subtitle: string;
}

@Schema({ _id: false, timestamps: false, versionKey: false })
class ValueObject {
  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  value: string;
}

@Schema({ collection: 'blog', timestamps: true, versionKey: false })
export class Blog {
  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  title: string;

  @Prop({ type: SchemaTypes.String, required: true, trim: true })
  subtitle: string;

  @Prop({ type: [Section], default: [] })
  sections: Section[]; // [{title, subtitle}, ...]

  @Prop({ type: [ValueObject], default: [] })
  seo: ValueObject[]; // [{value}, {value}, ...]

  @Prop({ type: [ValueObject], default: [] })
  tags: ValueObject[]; // [{value}, {value}, ...]

  @Prop({ type: SchemaTypes.Number, default: 0 })
  multiViews: number;

  @Prop({ type: [SchemaTypes.String], default: [] })
  uniqueViews: string[];

  @Prop({ type: SchemaTypes.Boolean, default: false })
  isArchive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: string;
}


export const BlogSchema = SchemaFactory.createForClass(Blog);

