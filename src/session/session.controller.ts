import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { CreateSession } from './create-session.usecase';
import { CreateSessionDto } from './dto/create-session.dto';
import { ListSessionDto } from './dto/list-session.dto';
import { User, UserSession } from '../signin/decorators/user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SessionService } from './session.service';

@Controller('session')
@ApiTags('Sessions')
@ApiBearerAuth()
export class SessionController {
  constructor(
    private readonly createSession: CreateSession,
    private readonly sessionService: SessionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session' })
  async create(
    @User() user: UserSession,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.createSession.execute({
      ...createSessionDto,
      userId: user.sub,
      accountId: user.accountId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List sessions with pagination and filters' })
  async findAll(
    @User() user: UserSession,
    @Query() queryParams: ListSessionDto,
  ) {
    return this.sessionService.findAll(user.accountId, queryParams);
  }
}
