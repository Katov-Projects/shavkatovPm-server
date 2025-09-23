import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";

export type AuthDocument = Auth & Document;


@Schema({ collection: 'auth', timestamps: true, versionKey: false })
export class Auth {
  @Prop({ type: SchemaTypes.String, required: true })
  login: string;

  @Prop({ type: SchemaTypes.String, required: true })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);