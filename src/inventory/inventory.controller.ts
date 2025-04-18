import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User, UserSession } from '../signin/decorators/user.decorator';
import { OutputInventoryDto } from './dto/output-inventory.dto';
import { CreateOutputInventoryDto } from './dto/create-output-inventory.dto';
import { ListInventoryQueryDto } from './dto/list-inventory.dto';
import { InventoryListService } from './inventory-list.service';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly listService: InventoryListService,
  ) {}

  @Post()
  @ApiCreatedResponse({ type: OutputInventoryDto })
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
    @User() user: UserSession,
  ) {
    return this.inventoryService.create({
      ...createInventoryDto,
      accountId: user.accountId,
    });
  }

  @Patch(':id/output')
  @ApiOkResponse({ type: CreateOutputInventoryDto })
  async output(
    @Body() createInventoryDto: CreateOutputInventoryDto,
    @User() user: UserSession,
    @Param('id') inventoryId: string,
  ) {
    return this.inventoryService.output({
      ...createInventoryDto,
      accountId: user.accountId,
      inventoryId,
    });
  }

  @Patch(':id/input')
  @ApiOkResponse({ type: CreateOutputInventoryDto })
  async input(
    @Body() createInventoryDto: CreateOutputInventoryDto,
    @User() user: UserSession,
    @Param('id') inventoryId: string,
  ) {
    return this.inventoryService.input({
      ...createInventoryDto,
      accountId: user.accountId,
      inventoryId,
    });
  }

  @Get()
  @ApiOkResponse({
    type: OutputInventoryDto,
    isArray: true,
    description: 'List inventories with pagination and filters',
  })
  async list(@User() user: UserSession, @Query() query: ListInventoryQueryDto) {
    return this.listService.list(user.accountId, query);
  }
}
