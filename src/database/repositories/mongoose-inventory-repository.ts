import { InjectModel } from '@nestjs/mongoose';
import { InventoryRepository } from '../../inventory/entities/inventory-repository';
import { InventoryEntity } from '../../inventory/entities/inventory.entity';
import { Inventory } from '../schemas/inventory.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class MongooseInventoryRepository implements InventoryRepository {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
  ) {}

  async delete(id: string): Promise<void> {
    await this.inventoryModel.deleteOne({ _id: id }).exec();
  }

  async save(inventory: InventoryEntity): Promise<InventoryEntity> {
    const { id, ...rest } = inventory.getValue();

    if (id) {
      const inventoryUpdated = await this.inventoryModel.findOneAndUpdate(
        { _id: id },
        { $set: rest },
      );
      return InventoryEntity.createFromInventoryDB(inventoryUpdated);
    }
    const newInventory = await this.inventoryModel.create(rest);
    return InventoryEntity.createFromInventoryDB(newInventory);
  }
  async findById(id: string): Promise<InventoryEntity> {
    const inventory = await this.inventoryModel.findById(id).exec();
    if (!inventory) {
      throw new NotFoundException(`Inventory with id ${id} not found`);
    }
    return InventoryEntity.createFromInventoryDB(inventory);
  }
}
