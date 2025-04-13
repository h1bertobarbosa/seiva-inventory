import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { InventoryRepository } from '../inventory/entities/inventory-repository';
import { SessionEntity } from './entities/session.entity';
import { SessionRepository } from './entities/session.repository';
import { InventoryEntity } from '../inventory/entities/inventory.entity';

@Injectable()
export class CreateSession {
  constructor(
    @Inject(InventoryRepository)
    private readonly inventoryRepository: InventoryRepository,
    @Inject(SessionRepository)
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(createSessionDto: CreateSessionDto) {
    const inventories = await this.fetchInventories(createSessionDto);
    this.validateInventoryOwnership(inventories, createSessionDto.accountId);

    const stockUsed = this.mapInventoriesToStockUsed(
      inventories,
      createSessionDto,
    );
    const session = this.createSessionEntity(createSessionDto, stockUsed);

    this.updateInventoryStocks(inventories, createSessionDto, session);
    const leftOver = this.createLeftOverInventory(createSessionDto, session);
    inventories.push(leftOver);

    const result = await this.saveSessionAndInventories(session, inventories);

    return this.formatResponse(session, result);
  }

  private async fetchInventories(createSessionDto: CreateSessionDto) {
    return Promise.all(
      createSessionDto.inventoryUsed.map(async (inventory) => {
        return this.inventoryRepository.findById(inventory.id);
      }),
    );
  }

  private validateInventoryOwnership(
    inventories: InventoryEntity[],
    accountId: string,
  ) {
    if (
      inventories.some((inventory) => inventory.getAccountId() !== accountId)
    ) {
      throw new UnprocessableEntityException(
        'One or more inventories do not belong to the specified account.',
      );
    }
  }

  private mapInventoriesToStockUsed(
    inventories: InventoryEntity[],
    createSessionDto: CreateSessionDto,
  ) {
    const stockUsed = [];
    createSessionDto.inventoryUsed.forEach((inventoryUsed) => {
      inventories.forEach((inventory) => {
        if (inventory.getId() === inventoryUsed.id) {
          stockUsed.push({
            id: inventory.getId(),
            description: inventory.getDescription(),
            quantity: inventoryUsed.quantity,
          });
        }
      });
    });
    return stockUsed;
  }

  private createSessionEntity(
    createSessionDto: CreateSessionDto,
    stockUsed: any[],
  ) {
    const session = SessionEntity.create({
      ...createSessionDto,
      stockUsed,
      sessionDate: new Date(createSessionDto.sessionDate),
    });
    session.calculateUsedQuantity();
    return session;
  }

  private updateInventoryStocks(
    inventories: InventoryEntity[],
    createSessionDto: CreateSessionDto,
    session: SessionEntity,
  ) {
    createSessionDto.inventoryUsed.forEach((inventoryUsed) => {
      inventories.forEach((inventory) => {
        if (inventory.getId() === inventoryUsed.id) {
          inventory.removeStock(
            inventoryUsed.quantity,
            new Date(),
            session.getDescription(),
          );
        }
      });
    });
  }

  private createLeftOverInventory(
    createSessionDto: CreateSessionDto,
    session: SessionEntity,
  ) {
    return InventoryEntity.createFromDto({
      accountId: createSessionDto.accountId,
      description: `Saldo - ${session.getDescription()}`,
      input_type: 'Saldo',
      quantity: createSessionDto.quantityLeft,
      master_preparation: '',
      obs: '',
      origin: '',
      preparation_date: new Date(),
      tankage: '',
    });
  }

  private async saveSessionAndInventories(
    session: SessionEntity,
    inventories: InventoryEntity[],
  ) {
    const [savedSession] = await Promise.all([
      this.sessionRepository.save(session),
      ...inventories.map((inventory) =>
        this.inventoryRepository.save(inventory),
      ),
    ]);
    return savedSession;
  }

  private formatResponse(session: SessionEntity, savedSession: SessionEntity) {
    return {
      sessionId: savedSession.getId(),
      description: session.getDescription(),
    };
  }
}
