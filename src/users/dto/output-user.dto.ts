import { ApiProperty } from '@nestjs/swagger';

export class OutputUserDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;

  constructor(partial: any) {
    this.id = String(partial?.id || partial?._id);
    this.name = partial.name;
    this.email = partial.email;
    this.createdAt = partial.createdAt;
    this.updatedAt = partial.updatedAt;
  }
}
