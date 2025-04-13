import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { InventoryRepository } from '../inventory/entities/inventory-repository';
import { MongooseInventoryRepository } from '../database/repositories/mongoose-inventory-repository';
import { MongooseSessionRepository } from '../database/repositories/mongoose-session-repository';
import { SessionRepository } from './entities/session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Inventory,
  InventorySchema,
} from '../database/schemas/inventory.schema';
import { Session, SessionSchema } from '../database/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [SessionController],
  providers: [
    SessionService,
    { provide: InventoryRepository, useClass: MongooseInventoryRepository },
    { provide: SessionRepository, useClass: MongooseSessionRepository },
  ],
})
export class SessionModule {}
