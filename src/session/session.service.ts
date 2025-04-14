import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListSessionDto } from './dto/list-session.dto';
import { Session, SessionModel } from '../database/schemas/session.schema';
import {
  SessionOutput,
  PaginatedSessionOutput,
} from './interfaces/session-output.interface';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionModel>,
  ) {}

  async findAll(
    accountId: string,
    queryParams: ListSessionDto,
  ): Promise<PaginatedSessionOutput> {
    const filter = this.buildFilter(accountId, queryParams);
    const skip = (queryParams.page - 1) * queryParams.limit;

    const [sessions, total] = await Promise.all([
      this.sessionModel
        .find(filter)
        .skip(skip)
        .limit(queryParams.limit)
        .sort({ sessionDate: -1 })
        .lean()
        .exec(),
      this.sessionModel.countDocuments(filter),
    ]);

    return {
      data: sessions.map(this.formatSessionResponse),
      pagination: {
        total,
        page: queryParams.page,
        limit: queryParams.limit,
        totalPages: Math.ceil(total / queryParams.limit),
      },
    };
  }

  private buildFilter(accountId: string, queryParams: ListSessionDto) {
    const filter: Record<string, any> = { accountId };

    if (queryParams.description) {
      filter.sessionDescription = {
        $regex: queryParams.description,
        $options: 'i',
      };
    }

    if (queryParams.startDate || queryParams.endDate) {
      filter.sessionDate = {};

      if (queryParams.startDate) {
        filter.sessionDate.$gte = new Date(queryParams.startDate);
      }

      if (queryParams.endDate) {
        filter.sessionDate.$lte = new Date(queryParams.endDate);
      }
    }

    return filter;
  }

  private formatSessionResponse(session: SessionModel): SessionOutput {
    return {
      id: session._id.toString(),
      description: session.sessionDescription,
      sessionDate: session.sessionDate,
      masterDriver: session.masterDriver,
      masterSupport: session.masterSupport,
      quantityUsed: session.quantityUsed,
      quantityLeft: session.quantityLeft,
    };
  }
}
