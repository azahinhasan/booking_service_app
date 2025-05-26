import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { ActionLogger } from '../../../utils/action-logger';
import { ErrorLogger } from '../../../utils/error-logger';
import {
  CreateServiceBookingDto,
  UpdateServiceBookingDto,
} from './service-booking.dto';
import { PaginationDto } from 'src/lib/dtos/pagination.dto';

@Injectable()
export class ServiceBookingService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) {}

  async createBooking(dto: CreateServiceBookingDto) {
    try {
      const booking = await this.prisma.serviceBooking.create({
        data: {
          customerName: dto.customerName,
          phone: dto.phone,
          status: dto.status ?? 'PENDING',
          serviceId: dto.serviceId,
        },
      });

      await this.actionLogger.logAction(
        {
          referenceId: booking.id,
          refereceType: 'SERVICE_BOOKING',
          action: 'CREATE',
          context: 'ServiceBookingService - createBooking',
          description: `Booking for ${booking.customerName} created`,
          additionalInfo: null,
        },
        null,
      );

      return {
        status: 201,
        message: 'Booking created successfully',
        data: booking,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Failed to create booking',
        errorStack: error,
        context: 'ServiceBookingService - createBooking',
      });
    }
  }

  async getAllBookings(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const bookings = await this.prisma.serviceBooking.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: { service: true },
      });

      const totalCount = await this.prisma.serviceBooking.count();

      return {
        status: 200,
        message: 'Bookings retrieved successfully',
        page,
        limit,
        totalCount,
        bookings,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Error fetching bookings',
        errorStack: error,
        context: 'ServiceBookingService - getAllBookings',
      });
    }
  }

  async getBookingById(id: number) {
    try {
      const booking = await this.prisma.serviceBooking.findUnique({
        where: { id },
        include: { service: true },
      });

      if (!booking) {
        return { status: 404, message: 'Booking not found' };
      }

      return {
        status: 200,
        message: 'Booking fetched successfully',
        data: booking,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Error fetching booking by ID',
        errorStack: error,
        context: 'ServiceBookingService - getBookingById',
      });
    }
  }

  async getStatusById(id: number) {
    try {
      const booking = await this.prisma.serviceBooking.findUnique({
        where: { id },
        include: { service: true },
      });

      if (!booking) {
        return { status: 404, message: 'Booking not found' };
      }

      return {
        status: 200,
        message: 'Booking fetched successfully',
        data: booking.status,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Error fetching booking by ID',
        errorStack: error,
        context: 'ServiceBookingService - getBookingById',
      });
    }
  }

  async updateBooking(
    id: number,
    dto: UpdateServiceBookingDto,
    userId: number,
  ) {
    try {
      const existing = await this.prisma.serviceBooking.findUnique({
        where: { id },
      });
      if (!existing) {
        return { status: 404, message: 'Booking not found' };
      }

      const updated = await this.prisma.serviceBooking.update({
        where: { id },
        data: { ...dto },
      });

      await this.actionLogger.logAction(
        {
          referenceId: updated.id,
          refereceType: 'SERVICE_BOOKING',
          action: 'UPDATE',
          context: 'ServiceBookingService - updateBooking',
          description: `Booking ${updated.bookingUid} updated`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Booking updated successfully',
        data: updated,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Failed to update booking',
        errorStack: error,
        context: 'ServiceBookingService - updateBooking',
      });
    }
  }

  async deleteBooking(id: number, userId: number) {
    try {
      const booking = await this.prisma.serviceBooking.findUnique({
        where: { id },
      });

      if (!booking) {
        return { status: 404, message: 'Booking not found' };
      }

      await this.prisma.serviceBooking.delete({ where: { id } });

      await this.actionLogger.logAction(
        {
          referenceId: booking.id,
          refereceType: 'SERVICE_BOOKING',
          action: 'DELETE',
          context: 'ServiceBookingService - deleteBooking',
          description: `Booking ${booking.bookingUid} deleted`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Booking deleted successfully',
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Failed to delete booking',
        errorStack: error,
        context: 'ServiceBookingService - deleteBooking',
      });
    }
  }
}
