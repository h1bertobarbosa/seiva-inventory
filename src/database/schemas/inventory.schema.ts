import { Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class InventoryHistory extends Document {
  @Prop()
  quantity: number;

  @Prop()
  obs: string;

  @Prop()
  inputDate: Date;
}
export const BodySchema = SchemaFactory.createForClass(InventoryHistory);
export interface InventoryHistoryModel {
  quantity: number;
  obs: string;
  inputDate: Date;
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
  masterPreparation: string;
  @Prop()
  inputType: string;
  @Prop()
  obs: string;
  @Prop()
  preparationDate: Date;
  @Prop()
  quantity: number;
  @Prop({ type: [BodySchema], default: [] })
  history: InventoryHistoryModel[];
}

export const InventorySchema = SchemaFactory.createForClass(Inventory).index({
  accountId: 1,
});
