import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { InventoryRepository } from '../inventory/entities/inventory-repository';
import { SessionRepository } from './entities/session.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { InventoryEntity } from '../inventory/entities/inventory.entity';
import { SessionEntity } from './entities/session.entity';

describe('SessionService', () => {
  let service: SessionService;
  let inventoryRepository: jest.Mocked<InventoryRepository>;
  let sessionRepository: jest.Mocked<SessionRepository>;

  const mockInventoryRepository = {
    findById: jest.fn(),
    save: jest.fn(),
  };

  const mockSessionRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: InventoryRepository,
          useValue: mockInventoryRepository,
        },
        {
          provide: SessionRepository,
          useValue: mockSessionRepository,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    inventoryRepository = module.get(InventoryRepository);
    sessionRepository = module.get(SessionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockDate = new Date('2023-01-01T10:00:00Z');
    const mockAccountId = 'account-123';
    const mockUserId = 'user-123';
    const mockInventoryId1 = 'inventory-123';
    const mockInventoryId2 = 'inventory-456';

    const createSessionDto: CreateSessionDto = {
      accountId: mockAccountId,
      userId: mockUserId,
      sessionDescription: 'Test Session',
      masterDriver: 'John Doe',
      masterSupport: 'Jane Smith',
      explanation: 'Test explanation',
      documentReader: 'Reader 1',
      sessionDate: mockDate.toISOString(),
      quantityLeft: 10,
      cupsQuantity: 5,
      inventoryUsed: [
        { id: mockInventoryId1, quantity: 15 },
        { id: mockInventoryId2, quantity: 10 },
      ],
    };

    const mockInventory1 = {
      getId: () => mockInventoryId1,
      getAccountId: () => mockAccountId,
      getDescription: () => 'Test Inventory 1',
      getQuantity: () => 20,
      removeStock: jest.fn(),
      getValue: () => ({
        id: mockInventoryId1,
        accountId: mockAccountId,
        quantity: 20,
      }),
    };

    const mockInventory2 = {
      getId: () => mockInventoryId2,
      getAccountId: () => mockAccountId,
      getDescription: () => 'Test Inventory 2',
      getQuantity: () => 15,
      removeStock: jest.fn(),
      getValue: () => ({
        id: mockInventoryId2,
        accountId: mockAccountId,
        quantity: 15,
      }),
    };

    const mockSession = {
      getId: () => 'session-123',
      getDescription: () => 'Test Session',
      calculateUsedQuantity: jest.fn().mockReturnValue(25),
      getValue: () => ({
        id: 'session-123',
        description: 'Test Session',
        quantityUsed: 25,
      }),
    };

    beforeEach(() => {
      jest.spyOn(SessionEntity, 'create').mockReturnValue(mockSession as any);
      jest.spyOn(InventoryEntity, 'createFromDto').mockReturnValue({
        getId: () => 'leftover-123',
        getValue: () => ({
          id: 'leftover-123',
          accountId: mockAccountId,
          quantity: 10,
        }),
      } as any);

      inventoryRepository.findById
        .mockResolvedValueOnce(mockInventory1 as any)
        .mockResolvedValueOnce(mockInventory2 as any);

      sessionRepository.save.mockResolvedValue(mockSession as any);
      inventoryRepository.save.mockImplementation((inventory) =>
        Promise.resolve(inventory),
      );
    });

    it('should successfully create a session with multiple inventories', async () => {
      const result = await service.execute(createSessionDto);

      expect(result).toEqual({
        sessionId: 'session-123',
        description: 'Test Session',
      });

      // Verify inventory lookups
      expect(inventoryRepository.findById).toHaveBeenCalledWith(
        mockInventoryId1,
      );
      expect(inventoryRepository.findById).toHaveBeenCalledWith(
        mockInventoryId2,
      );

      // Verify session creation
      expect(SessionEntity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: mockAccountId,
          userId: mockUserId,
          sessionDescription: 'Test Session',
          stockUsed: expect.arrayContaining([
            expect.objectContaining({ id: mockInventoryId1 }),
            expect.objectContaining({ id: mockInventoryId2 }),
          ]),
        }),
      );

      // Verify stock removal
      expect(mockInventory1.removeStock).toHaveBeenCalledWith(
        15,
        expect.any(Date),
        'Test Session',
      );
      expect(mockInventory2.removeStock).toHaveBeenCalledWith(
        10,
        expect.any(Date),
        'Test Session',
      );

      // Verify leftover creation
      expect(InventoryEntity.createFromDto).toHaveBeenCalledWith(
        expect.objectContaining({
          accountId: mockAccountId,
          description: expect.stringContaining('Saldo'),
          quantity: 10,
          input_type: 'Saldo',
        }),
      );

      // Verify saves
      expect(sessionRepository.save).toHaveBeenCalledWith(mockSession);
      expect(inventoryRepository.save).toHaveBeenCalledTimes(3); // 2 original inventories + 1 leftover
    });

    it('should throw UnprocessableEntityException when inventory does not belong to account', async () => {
      const differentAccountInventory = {
        ...mockInventory1,
        getAccountId: () => 'different-account',
      };
      inventoryRepository.findById
        .mockReset()
        .mockResolvedValueOnce(differentAccountInventory as any);

      await expect(service.execute(createSessionDto)).rejects.toThrow(
        new UnprocessableEntityException(
          'One or more inventories do not belong to the specified account.',
        ),
      );
    });

    it('should calculate used quantity correctly', async () => {
      await service.execute(createSessionDto);

      expect(mockSession.calculateUsedQuantity).toHaveBeenCalled();
      expect(InventoryEntity.createFromDto).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: createSessionDto.quantityLeft,
        }),
      );
    });

    it('should update all inventories with correct quantities', async () => {
      await service.execute(createSessionDto);

      const savedInventories = inventoryRepository.save.mock.calls.map(
        (call) => call[0],
      );

      // Check original inventories were updated
      expect(savedInventories).toContainEqual(
        expect.objectContaining({
          getId: expect.any(Function),
          getQuantity: expect.any(Function),
        }),
      );

      // Check leftover inventory was created
      expect(savedInventories).toContainEqual(
        expect.objectContaining({
          getId: expect.any(Function),
          getValue: expect.any(Function),
        }),
      );
    });
  });
});
