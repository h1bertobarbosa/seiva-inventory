import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OutputInventoryDto } from './dto/output-inventory.dto';
import { CreateOutputInventoryDto } from './dto/create-output-inventory.dto';
import { Inventory } from '../database/schemas/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
  ) {}

  async create(
    createInventoryDto: CreateInventoryDto,
  ): Promise<OutputInventoryDto> {
    const createdInventory =
      await this.inventoryModel.create(createInventoryDto);
    return OutputInventoryDto.fromInventory(createdInventory);
  }

  async output(input: CreateOutputInventoryDto) {
    const inventory = await this.inventoryModel
      .findById(input.inventoryId)
      .exec();
    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    inventory.quantity -= input.quantity;
    const history = {
      quantity: -input.quantity,
      outputDate: input.outputDate || new Date(),
      obs: input.obs,
    };
    if (!Array.isArray(inventory.history)) {
      inventory.history = [history];
    } else {
      inventory.history.push(history);
    }
    inventory.markModified('history');
    await inventory.save();
    return OutputInventoryDto.fromInventory(inventory);
  }

  findAll() {
    return `This action returns all inventory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
