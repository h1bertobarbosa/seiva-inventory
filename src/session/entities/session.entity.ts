import { UnprocessableEntityException } from '@nestjs/common';
import { StockUsed } from './stock-used.entity';
import { InventoryQuantity } from '../../inventory/entities/inventory-quantity';
interface StockUsedParams {
  id: string;
  description: string;
  quantity: number;
}

interface InputParam {
  id?: string;
  accountId: string;
  userId: string;
  sessionDescription: string;
  masterDriver: string;
  masterSupport: string;
  explanation: string;
  documentReader: string;
  sessionDate: Date;
  stockUsed: StockUsedParams[];
  quantityLeft: number;
  cupsQuantity?: number;
  quantityUsed?: number;
  stockLeft?: StockUsedParams;
}

export class SessionEntity {
  private constructor(
    private id: string,
    private accountId: string,
    private UserId: string,
    private sessionDescription: string,
    private masterDriver: string,
    private masterSupport: string,
    private explanation: string,
    private documentReader: string,
    private sessionDate: Date,
    private stockUsed: StockUsed[],
    private quantityLeft: InventoryQuantity,
    private cupsQuantity: number,
    private quantityUsed: number,
    private stockLeft?: StockUsed,
  ) {
    if (this.stockUsed.length === 0) {
      throw new UnprocessableEntityException('StockUsed cannot be empty');
    }
  }

  static create(params: InputParam): SessionEntity {
    const stockUsed = params.stockUsed.map((stock) => StockUsed.create(stock));
    const stockLeft = params?.stockLeft
      ? StockUsed.create(params.stockLeft)
      : undefined;
    const sessionDate = new Date(params.sessionDate);
    return new SessionEntity(
      params?.id || '',
      params.accountId,
      params.userId,
      params.sessionDescription,
      params.masterDriver,
      params.masterSupport,
      params.explanation,
      params.documentReader,
      sessionDate,
      stockUsed || [],
      InventoryQuantity.create(params.quantityLeft),
      params?.cupsQuantity || 0,
      params?.quantityUsed || 0,
      stockLeft,
    );
  }

  setStockLeft(stockLeft: StockUsedParams): void {
    this.stockLeft = StockUsed.create(stockLeft);
  }

  calculateUsedQuantity(): number {
    this.quantityUsed =
      this.stockUsed.reduce((total, stock) => total + stock.getQuantity(), 0) -
      this.quantityLeft.getValue();
    return this.quantityUsed;
  }

  getDescription(): string {
    return this.sessionDescription;
  }

  getId(): string {
    return this.id;
  }

  getAccountId(): string {
    return this.accountId;
  }

  getUserId(): string {
    return this.UserId;
  }

  getMasterDriver(): string {
    return this.masterDriver;
  }

  getMasterSupport(): string {
    return this.masterSupport;
  }

  getExplanation(): string {
    return this.explanation;
  }

  getDocumentReader(): string {
    return this.documentReader;
  }

  getSessionDate(): Date {
    return this.sessionDate;
  }

  getStockUsed(): StockUsed[] {
    return this.stockUsed;
  }

  getQuantityLeft(): number {
    return this.quantityLeft.getValue();
  }

  getCupsQuantity(): number {
    return this.cupsQuantity;
  }

  getQuantityUsed(): number {
    return this.quantityUsed;
  }

  getStockLeft(): StockUsed | undefined {
    return this.stockLeft;
  }
}
