import { Module } from '@nestjs/common';
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
import { CreateSession } from './create-session.usecase';
import { SessionService } from './session.service';
import { LibsModule } from '../libs/libs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    LibsModule,
  ],
  controllers: [SessionController],
  providers: [
    CreateSession,
    SessionService,
    { provide: InventoryRepository, useClass: MongooseInventoryRepository },
    { provide: SessionRepository, useClass: MongooseSessionRepository },
  ],
})
export class SessionModule {}
