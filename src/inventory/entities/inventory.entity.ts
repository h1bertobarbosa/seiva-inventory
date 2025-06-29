import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { InventoryHistory } from './input-inventory-history';
import { InventoryQuantity } from './inventory-quantity';

export class InventoryEntity {
  private constructor(
    private description: string,
    private tankage: string,
    private origin: string,
    private masterPreparation: string,
    private inputType: string,
    private obs: string,
    private preparationDate: Date,
    private quantity: InventoryQuantity,
    private history: InventoryHistory[],
    private accountId: string,
    private id?: string,
  ) {
    if (!this.history.length) {
      this.history.push(
        InventoryHistory.createFromData({
          quantity: this.quantity,
          obs: this.obs,
          inputDate: new Date(),
        }),
      );
    }
  }
  addStock(quantity: number, ocurrenceDate: Date, obs?: string) {
    this.quantity = this.quantity.add(InventoryQuantity.create(quantity));
    this.history.push(
      InventoryHistory.createFromData({
        quantity: InventoryQuantity.create(quantity),
        inputDate: ocurrenceDate,
        obs,
      }),
    );
  }
  removeStock(quantity: number, ocurrenceDate: Date, obs?: string) {
    this.quantity = this.quantity.subtract(InventoryQuantity.create(quantity));
    this.history.push(
      InventoryHistory.createFromData({
        quantity: InventoryQuantity.create(-quantity),
        inputDate: ocurrenceDate,
        obs,
      }),
    );
  }

  public static createFromDto(input: CreateInventoryDto): InventoryEntity {
    return new InventoryEntity(
      input.description,
      input.tankage,
      input.origin,
      input.master_preparation,
      input.input_type,
      input.obs,
      new Date(input.preparation_date),
      InventoryQuantity.create(input.quantity),
      [],
      input.accountId,
    );
  }

  public static createFromInventoryDB(inventory: any) {
    return new InventoryEntity(
      inventory.description,
      inventory.tankage,
      inventory.origin,
      inventory.masterPreparation,
      inventory.inputType,
      inventory.obs,
      inventory.preparationDate,
      InventoryQuantity.create(inventory.quantity / 1000),
      inventory.history.map((history: any) => {
        return InventoryHistory.createFromData({
          quantity: InventoryQuantity.create(history.quantity / 1000),
          inputDate: history.inputDate,
          obs: history.obs,
        });
      }),
      inventory.accountId,
      String(inventory._id),
    );
  }

  getAccountId(): string {
    return this.accountId;
  }

  getId(): string {
    return this.id;
  }

  getQuantity(): number {
    return this.quantity.getValue();
  }
  getDescription() {
    return this.description;
  }
  getInputType() {
    return this.inputType;
  }
  getQuantityInLiters(): number {
    return this.quantity.getValue() / 1000;
  }

  getValue() {
    return {
      id: this.id,
      accountId: this.accountId,
      description: this.description,
      tankage: this.tankage,
      origin: this.origin,
      masterPreparation: this.masterPreparation,
      inputType: this.inputType,
      obs: this.obs,
      preparationDate: this.preparationDate,
      quantity: this.quantity.getValue(),
      history: this.history.map((history) => history.getValue()),
    };
  }
}
