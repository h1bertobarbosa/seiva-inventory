import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { OutputInventoryDto } from './dto/output-inventory.dto';
import { CreateOutputInventoryDto } from './dto/create-output-inventory.dto';
import { InventoryEntity } from './entities/inventory.entity';
import { InventoryRepository } from './entities/inventory-repository';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(InventoryRepository)
    private readonly inventoryRepository: InventoryRepository,
  ) {}

  async create(
    createInventoryDto: CreateInventoryDto,
  ): Promise<OutputInventoryDto> {
    const inventory = await this.inventoryRepository.save(
      InventoryEntity.createFromDto(createInventoryDto),
    );
    return OutputInventoryDto.fromInventory(inventory.getValue());
  }

  async output(input: CreateOutputInventoryDto) {
    const inventory = await this.inventoryRepository.findById(
      input.inventoryId,
    );

    inventory.removeStock(
      input.quantity,
      input.outputDate || new Date(),
      input.obs,
    );

    await this.inventoryRepository.save(inventory);
    return OutputInventoryDto.fromInventory(inventory);
  }

  async input(input: CreateOutputInventoryDto) {
    const inventory = await this.inventoryRepository.findById(
      input.inventoryId,
    );

    inventory.addStock(
      input.quantity,
      input.outputDate || new Date(),
      input.obs,
    );

    await this.inventoryRepository.save(inventory);
    return OutputInventoryDto.fromInventory(inventory);
  }
}
