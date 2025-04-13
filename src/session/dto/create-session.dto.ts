import { ApiProperty } from '@nestjs/swagger';
class StockUsed {
  @ApiProperty()
  id: string;
  @ApiProperty()
  quantity: number;
}
export class CreateSessionDto {
  @ApiProperty()
  sessionDescription: string;
  @ApiProperty()
  masterDriver: string;
  @ApiProperty()
  masterSupport: string;
  @ApiProperty()
  explanation: string;
  @ApiProperty()
  documentReader: string;
  @ApiProperty({ example: '2025-04-10T22:19:16.610Z' })
  sessionDate: string;
  @ApiProperty()
  quantityLeft: number;
  @ApiProperty()
  cupsQuantity: number;
  @ApiProperty({ type: [StockUsed] })
  inventoryUsed: StockUsed[];
  accountId: string;
  userId: string;
}
