import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from './service.service';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { ActionLogger } from '../../../utils/action-logger';
import { ErrorLogger } from '../../../utils/error-logger';
import { PaginationDto } from '../../lib/dtos/pagination.dto';

describe('ServiceService - getAllServices', () => {
  let serviceService: ServiceService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    service: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockActionLogger = {
    logAction: jest.fn(),
  };

  const mockErrorLogger = {
    errorlogger: jest.fn().mockImplementation((err) => err),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ActionLogger, useValue: mockActionLogger },
        { provide: ErrorLogger, useValue: mockErrorLogger },
      ],
    }).compile();

    serviceService = module.get<ServiceService>(ServiceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated services', async () => {
    const mockServices = [
      {
        name: 'Service Name 1',
        category: 'Service Category',
        price: 99.99,
        description: 'A detailed description of the service',
      },
    ];

    mockPrismaService.service.findMany.mockResolvedValue(mockServices);
    mockPrismaService.service.count.mockResolvedValue(1);
    const pagination: PaginationDto = { page: 1, limit: 10 };
    const result = await serviceService.getAllServices(pagination);

    expect(mockPrismaService.service.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { id: 'desc' },
    });

    expect(mockPrismaService.service.count).toHaveBeenCalled();

    expect(result).toEqual({
      status: 200,
      message: 'Services retrieved successfully',
      page: 1,
      limit: 10,
      totalCount: 1,
      services: mockServices,
    });
  });
});
