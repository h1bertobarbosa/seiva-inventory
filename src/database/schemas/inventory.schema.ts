import { Types } from 'mongoose';
import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class InventoryHistory extends Document {
  @Prop()
  quantity: number;

  @Prop()
  obs: string;

  @Prop()
  outputDate: Date;
}
export const BodySchema = SchemaFactory.createForClass(InventoryHistory);
export interface InventoryHistoryModel {
  quantity: number;
  obs: string;
  outputDate: Date;
}
@Schema({ timestamps: true })
export class Inventory extends Document {
  @Prop({ required: true, type: Types.ObjectId })
  accountId: string;
  @Prop()
  description: string;
  @Prop()
  tankage: string;
  @Prop()
  origin: string;
  @Prop()
  master_preparation: string;
  @Prop()
  input_type: string;
  @Prop()
  obs: string;
  @Prop()
  preparation_date: Date;
  @Prop()
  quantity: number;
  @Prop({ type: [BodySchema], default: [] })
  history: InventoryHistoryModel[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory).index({
  accountId: 1,
});
