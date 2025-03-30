import { ApiProperty } from '@nestjs/swagger';

export class OutputInventoryDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  tankage: string;
  @ApiProperty()
  origin: string;
  @ApiProperty()
  masterPreparation: string;
  @ApiProperty()
  inputType: string;
  @ApiProperty()
  obs: string;
  @ApiProperty()
  preparationDate: Date;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  static fromInventory(inventory: any) {
    return {
      id: inventory.id,
      description: inventory.description,
      tankage: inventory.tankage,
      origin: inventory.origin,
      masterPreparation: inventory.master_preparation,
      inputType: inventory.input_type,
      obs: inventory.obs,
      preparationDate: inventory.preparation_date,
      quantity: inventory.quantity,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    };
  }
}
