import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { OutputInventoryDto } from './dto/output-inventory.dto';
import { CreateOutputInventoryDto } from './dto/create-output-inventory.dto';
import { InventoryEntity } from './entities/inventory.entity';
import { InventoryRepository } from './entities/inventory-repository';
import { LOGGER_PROVIDER } from '../libs/logger/logger-provider.const';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(InventoryRepository)
    private readonly inventoryRepository: InventoryRepository,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async create(
    createInventoryDto: CreateInventoryDto,
  ): Promise<OutputInventoryDto> {
    const inventory = await this.inventoryRepository.save(
      InventoryEntity.createFromDto(createInventoryDto),
    );
    this.logger.log(
      `Inventory created with id ${inventory.getId()} description ${inventory.getDescription()} and quantity ${inventory.getQuantity()}`,
    );
    return OutputInventoryDto.fromInventory(inventory.getValue());
  }

  async output(input: CreateOutputInventoryDto) {
    const inventory = await this.inventoryRepository.findById(
      input.inventoryId,
    );
    this.logger.log(
      `Inventory output with id ${inventory.getId()} quantity ${inventory.getQuantity()} removeStock: ${input.quantity}|${input.obs}`,
    );
    inventory.removeStock(
      input.quantity,
      input.outputDate || new Date(),
      input.obs,
    );
    if (inventory.getQuantity() < 0) {
      throw new Error('Insufficient stock');
    }

    await this.inventoryRepository.save(inventory);
    this.logger.log(
      `Inventory output saved with id ${inventory.getId()} description ${inventory.getDescription()} and quantity ${inventory.getQuantity()}`,
    );
    return OutputInventoryDto.fromInventory(inventory);
  }

  async input(input: CreateOutputInventoryDto) {
    const inventory = await this.inventoryRepository.findById(
      input.inventoryId,
    );
    this.logger.log(
      `Inventory input with id ${inventory.getId()} quantity ${inventory.getQuantity()} addStock: ${input.quantity}|${input.obs}`,
    );
    inventory.addStock(
      input.quantity,
      input.outputDate || new Date(),
      input.obs,
    );

    await this.inventoryRepository.save(inventory);
    this.logger.log(
      `Inventory intput saved with id ${inventory.getId()} description ${inventory.getDescription()} and quantity ${inventory.getQuantity()}`,
    );
    return OutputInventoryDto.fromInventory(inventory);
  }
}
