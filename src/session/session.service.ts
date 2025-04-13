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
export class SessionService {
  constructor(
    @Inject(InventoryRepository)
    private readonly inventoryRepository: InventoryRepository,
    @Inject(SessionRepository)
    private readonly sessionRepository: SessionRepository,
  ) {}
  async execute(createSessionDto: CreateSessionDto) {
    const inventories = await Promise.all(
      createSessionDto.inventoryUsed.map(async (inventory) => {
        return this.inventoryRepository.findById(inventory.id);
      }),
    );
    if (
      inventories.some(
        (inventory) => inventory.getAccountId() !== createSessionDto.accountId,
      )
    ) {
      throw new UnprocessableEntityException(
        'One or more inventories do not belong to the specified account.',
      );
    }

    const stockUsed = inventories.map((inventory) => {
      return {
        id: inventory.getId(),
        description: inventory.getDescription(),
        quantity: inventory.getQuantity(),
      };
    });
    const session = SessionEntity.create({
      ...createSessionDto,
      stockUsed,
      sessionDate: new Date(createSessionDto.sessionDate),
    });
    session.calculateUsedQuantity();
    createSessionDto.inventoryUsed.forEach((inventory) => {
      inventories.forEach((inv) => {
        if (inv.getId() === inventory.id) {
          inv.removeStock(
            inventory.quantity,
            new Date(),
            session.getDescription(),
          );
        }
      });
    });
    const leftOver = InventoryEntity.createFromDto({
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
    inventories.push(leftOver);

    const [savedSession] = await Promise.all([
      this.sessionRepository.save(session),
      ...inventories.map((inventory) =>
        this.inventoryRepository.save(inventory),
      ),
    ]);
    return {
      sessionId: savedSession.getId(),
      description: session.getDescription(),
    };
  }
}
