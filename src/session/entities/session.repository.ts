import { SessionEntity } from './session.entity';

export interface SessionRepository {
  save(session: SessionEntity): Promise<SessionEntity>;
}

export const SessionRepository = Symbol('SessionRepository');
