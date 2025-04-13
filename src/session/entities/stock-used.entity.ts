import { InventoryQuantity } from '../../inventory/entities/inventory-quantity';

export class StockUsed {
  private constructor(
    private id: string,
    private description: string,
    private quantity: InventoryQuantity,
  ) {}
  static create(param: {
    id: string;
    description: string;
    quantity: number;
  }): StockUsed {
    return new StockUsed(
      param.id,
      param.description,
      InventoryQuantity.create(param.quantity),
    );
  }

  getQuantity() {
    return this.quantity.getValue();
  }

  getId() {
    return this.id;
  }

  getDescription() {
    return this.description;
  }
}
