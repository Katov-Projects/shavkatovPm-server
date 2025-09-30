import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

export type CategoryDocument = Category & Document;

@Schema({collection: "category", timestamps: true, versionKey: false})
export class Category {

  @Prop({type: SchemaTypes.String, required: true})
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual('blog', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'categoryId',
});

CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });
