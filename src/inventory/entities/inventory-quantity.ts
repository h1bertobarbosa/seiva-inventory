export class InventoryQuantity {
  private militers: number;
  private constructor(liters: number) {
    this.militers = liters * 1000;
  }
  public static create(liters: number): InventoryQuantity {
    return new InventoryQuantity(liters);
  }
  getValue(): number {
    return Number(this.militers);
  }
  subtract(quantity: InventoryQuantity): InventoryQuantity {
    return InventoryQuantity.create(
      (this.militers - quantity.getValue()) / 1000,
    );
  }
  add(quantity: InventoryQuantity): InventoryQuantity {
    return InventoryQuantity.create(
      (this.militers + quantity.getValue()) / 1000,
    );
  }
}
