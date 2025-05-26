import { Test, TestingModule } from '@nestjs/testing';
import { ServiceBookingService } from './service-booking.service';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { ActionLogger } from '../../../utils/action-logger';
import { ErrorLogger } from '../../../utils/error-logger';
import { CreateServiceBookingDto } from './service-booking.dto';

describe('ServiceBookingService', () => {
  let serviceBookingService: ServiceBookingService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    serviceBooking: {
      create: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
        ServiceBookingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ActionLogger, useValue: mockActionLogger },
        { provide: ErrorLogger, useValue: mockErrorLogger },
      ],
    }).compile();

    serviceBookingService = module.get<ServiceBookingService>(ServiceBookingService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      const dto: CreateServiceBookingDto = {
        customerName: 'John Doe',
        phone: '+88012345678911',
        serviceId: 1
      };
      const mockBooking = {
        id: 1,
        customerName: 'John Doe',
        phone: '+88012345678911',
        serviceId: 1,
        status: 'PENDING',
      };

      mockPrismaService.serviceBooking.create.mockResolvedValue(mockBooking);

      const result = await serviceBookingService.createBooking(dto);

      expect(mockPrismaService.serviceBooking.create).toHaveBeenCalledWith({
        data: {
          customerName: dto.customerName,
          phone: dto.phone,
          status: 'PENDING',
          serviceId: dto.serviceId,
        },
      });

      expect(result).toEqual({
        status: 201,
        message: 'Booking created successfully',
        data: mockBooking,
      });
    });
  });

  describe('getStatusById', () => {
    it('should retrieve the status of a booking by ID', async () => {
      const bookingId = 1;
      const mockBooking = {
        id: 1,
        status: 'PENDING',
      };

      mockPrismaService.serviceBooking.findUnique.mockResolvedValue(mockBooking);

      const result = await serviceBookingService.getStatusById(bookingId);

      expect(mockPrismaService.serviceBooking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: { service: true },
      });
      expect(result).toEqual({
        status: 200,
        message: 'Booking fetched successfully',
        data: mockBooking.status,
      });
    });

    it('should return 404 if booking is not found', async () => {
      const bookingId = 1;

      mockPrismaService.serviceBooking.findUnique.mockResolvedValue(null);

      const result = await serviceBookingService.getStatusById(bookingId);

      expect(mockPrismaService.serviceBooking.findUnique).toHaveBeenCalledWith({
        where: { id: bookingId },
        include: { service: true },
      });
      expect(result).toEqual({
        status: 404,
        message: 'Booking not found',
      });
    });

    it('should handle errors when fetching booking status', async () => {
      const bookingId = 1;
      const error = new Error('Database error');

      mockPrismaService.serviceBooking.findUnique.mockRejectedValue(error);

      const result = await serviceBookingService.getStatusById(bookingId);

      expect(result).toEqual({
        errorMessage: 'Error fetching booking by ID',
        errorStack: error,
        context: 'ServiceBookingService - getBookingById',
      });
    });
  });
});
