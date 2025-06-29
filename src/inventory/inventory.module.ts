import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Inventory,
  InventorySchema,
} from '../database/schemas/inventory.schema';
import { InventoryRepository } from './entities/inventory-repository';
import { MongooseInventoryRepository } from '../database/repositories/mongoose-inventory-repository';
import { InventoryListService } from './inventory-list.service';
import { LibsModule } from '../libs/libs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
    ]),
    LibsModule,
  ],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    InventoryListService,
    {
      provide: InventoryRepository,
      useClass: MongooseInventoryRepository,
    },
  ],
})
export class InventoryModule {}
