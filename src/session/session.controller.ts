import { Controller, Post, Body } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { User, UserSession } from '../signin/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('session')
@ApiBearerAuth()
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(
    @User() user: UserSession,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.sessionService.execute({
      ...createSessionDto,
      userId: user.sub,
      accountId: user.accountId,
    });
  }
}
