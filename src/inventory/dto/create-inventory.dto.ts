import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty()
  description: string;
  @ApiProperty()
  tankage: string;
  @ApiProperty()
  origin: string;
  @ApiProperty()
  master_preparation: string;
  @ApiProperty()
  input_type: string;
  @ApiProperty()
  obs: string;
  @ApiProperty()
  preparation_date: Date;
  @ApiProperty()
  quantity: number;
  accountId: string;
}
