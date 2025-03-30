import { ApiProperty } from '@nestjs/swagger';

export class CreateOutputInventoryDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  obs: string;

  @ApiProperty()
  outputDate: Date;
  accountId: string;
  inventoryId: string;
}
