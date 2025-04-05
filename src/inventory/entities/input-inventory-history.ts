import { InventoryQuantity } from './inventory-quantity';

export class InventoryHistory {
  private constructor(
    private quantity: InventoryQuantity,
    private inputDate: Date,
    private obs?: string,
  ) {}

  public static createFromData(input: {
    quantity: InventoryQuantity;
    inputDate: Date;
    obs?: string;
  }): InventoryHistory {
    return new InventoryHistory(
      input.quantity,
      new Date(input.inputDate),
      input.obs,
    );
  }

  getValue() {
    return {
      quantity: this.quantity.getValue(),
      inputDate: this.inputDate,
      obs: this.obs,
    };
  }
}
