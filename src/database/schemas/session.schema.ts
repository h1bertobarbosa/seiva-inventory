import { Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class StockUsed extends Document {
  @Prop({ required: true, type: Types.ObjectId })
  id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity: number;
}

export const StockUsedSchema = SchemaFactory.createForClass(StockUsed);

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ required: true, type: Types.ObjectId })
  accountId: string;

  @Prop({ required: true, type: Types.ObjectId })
  userId: string;

  @Prop({ required: true })
  sessionDescription: string;

  @Prop({ required: true })
  masterDriver: string;

  @Prop({ required: true })
  masterSupport: string;

  @Prop()
  explanation: string;

  @Prop()
  documentReader: string;

  @Prop({ required: true, type: Date })
  sessionDate: Date;

  @Prop({
    type: [StockUsedSchema],
    required: true,
    validate: [(val: any[]) => val.length > 0, 'Stock used cannot be empty'],
  })
  stockUsed: StockUsed[];

  @Prop({
    type: StockUsedSchema,
  })
  stockLeft: StockUsed;

  @Prop({ required: true })
  quantityLeft: number;

  @Prop({ default: 0 })
  cupsQuantity: number;

  @Prop({ required: true })
  quantityUsed: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session)
  .index({ accountId: 1 })
  .index({ userId: 1 })
  .index({ sessionDate: -1 });

export interface StockUsedModel {
  id: string;
  description: string;
  quantity: number;
}

export interface SessionModel extends Document {
  accountId: string;
  userId: string;
  sessionDescription: string;
  masterDriver: string;
  masterSupport: string;
  explanation: string;
  documentReader: string;
  sessionDate: Date;
  stockUsed: StockUsedModel[];
  stockLeft: StockUsedModel;
  quantityLeft: number;
  cupsQuantity: number;
  quantityUsed: number;
  createdAt: Date;
  updatedAt: Date;
}
