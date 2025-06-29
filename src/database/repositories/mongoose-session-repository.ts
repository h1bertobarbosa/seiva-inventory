import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionRepository } from '../../session/entities/session.repository';
import { SessionEntity } from '../../session/entities/session.entity';
import { Session } from '../schemas/session.schema';

export class MongooseSessionRepository implements SessionRepository {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>,
  ) {}

  async save(session: SessionEntity): Promise<SessionEntity> {
    const sessionData = this.mapSessionEntityToModel(session);
    const { id, ...sessionDetails } = sessionData;

    if (id) {
      const savedSession = await this.sessionModel.findOneAndUpdate(
        { _id: id },
        { $set: sessionDetails },
        { new: true },
      );
      return this.mapModelToSessionEntity(savedSession);
    }
    const savedSession = await this.sessionModel.create(sessionDetails);
    return this.mapModelToSessionEntity(savedSession);
  }

  private mapSessionEntityToModel(session: SessionEntity): Record<string, any> {
    return {
      id: session.getId(),
      sessionDescription: session.getDescription(),
      stockUsed: session.getStockUsed().map((stock) => ({
        id: stock.getId(),
        description: stock.getDescription(),
        quantity: stock.getQuantity(),
      })),
      quantityUsed: session.getQuantityUsed(),
      quantityLeft: session.getQuantityLeft(),
      cupsQuantity: session.getCupsQuantity(),
      accountId: session.getAccountId(),
      userId: session.getUserId(),
      masterDriver: session.getMasterDriver(),
      masterSupport: session.getMasterSupport(),
      explanation: session.getExplanation(),
      documentReader: session.getDocumentReader(),
      sessionDate: session.getSessionDate(),
      stockLeft: {
        id: session.getStockLeft().getId(),
        description: session.getStockLeft().getDescription(),
        quantity: session.getStockLeft().getQuantity(),
      },
    };
  }

  private mapModelToSessionEntity(session: Session): SessionEntity {
    return SessionEntity.create({
      id: session._id.toString(),
      accountId: session.accountId.toString(),
      userId: session.userId.toString(),
      sessionDescription: session.sessionDescription,
      masterDriver: session.masterDriver,
      masterSupport: session.masterSupport,
      explanation: session.explanation,
      documentReader: session.documentReader,
      sessionDate: session.sessionDate,
      stockUsed: session.stockUsed.map((stock) => ({
        id: stock.id.toString(),
        description: stock.description,
        quantity: stock.quantity,
      })),
      quantityLeft: session.quantityLeft,
      cupsQuantity: session.cupsQuantity,
      quantityUsed: session.quantityUsed,
      stockLeft: {
        id: session.stockLeft.id.toString(),
        description: session.stockLeft.description,
        quantity: session.stockLeft.quantity,
      },
    });
  }
}
