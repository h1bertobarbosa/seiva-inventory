import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListSessionDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Filter by start date' })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ description: 'Filter by end date' })
  endDate?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Search by session description' })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiPropertyOptional({ default: 10 })
  limit?: number = 10;
}
