import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from '../database/schemas/inventory.schema';
import { Model } from 'mongoose';
import { ListInventoryQueryDto } from './dto/list-inventory.dto';
import { OutputInventoryDto } from './dto/output-inventory.dto';

export class InventoryListService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly inventoryModel: Model<Inventory>,
  ) {}
  async list(accountId: string, query: ListInventoryQueryDto) {
    const skip = (query.page - 1) * query.limit;

    const filter: any = {
      accountId,
    };

    if (query.description) {
      filter.description = { $regex: query.description, $options: 'i' };
    }

    if (query.masterPreparation) {
      filter.master_preparation = {
        $regex: query.masterPreparation,
        $options: 'i',
      };
    }

    if (query.preparationDate) {
      const startDate = new Date(query.preparationDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(query.preparationDate);
      endDate.setHours(23, 59, 59, 999);

      filter.preparation_date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const [items, total] = await Promise.all([
      this.inventoryModel
        .find(filter)
        .skip(skip)
        .limit(query.limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec(),
      this.inventoryModel.countDocuments(filter),
    ]);

    return {
      items: items.map((item) => OutputInventoryDto.fromInventory(item)),
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit),
    };
  }
}
