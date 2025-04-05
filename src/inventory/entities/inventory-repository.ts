import { InventoryEntity } from './inventory.entity';

export interface InventoryRepository {
  save(inventory: InventoryEntity): Promise<InventoryEntity>;
  findById(id: string): Promise<InventoryEntity>;
}

export const InventoryRepository = Symbol('InventoryRepository');
