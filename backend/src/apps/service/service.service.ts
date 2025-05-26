import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ActionLogger } from 'utils/action-logger';
import { ErrorLogger } from 'utils/error-logger';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { PaginationDto } from 'src/lib/dtos/pagination.dto';

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    private actionLogger: ActionLogger,
    private errorLogger: ErrorLogger,
  ) {}

  async createService(dto: CreateServiceDto, userId: number) {
    try {
      const service = await this.prisma.service.create({
        data: {
          name: dto.name,
          category: dto.category,
          price: dto.price,
          description: dto.description,
          isActive: dto.isActive ?? true,
        },
      });

      await this.actionLogger.logAction(
        {
          referenceId: service.id,
          refereceType: 'SERVICE',
          action: 'CREATE',
          context: 'ServiceService - createService',
          description: `Service ${service.name} created`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 201,
        message: 'Service created successfully',
        data: service,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Failed to create service',
        errorStack: error,
        context: 'ServiceService - createService',
      });
    }
  }

  async getAllServices(pagination: PaginationDto) {
    try {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;

      const services = await this.prisma.service.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      });

      const totalCount = await this.prisma.service.count();

      return {
        status: 200,
        message: 'Services retrieved successfully',
        page,
        limit,
        totalCount,
        services,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Error fetching services',
        errorStack: error,
        context: 'ServiceService - getAllServices',
      });
    }
  }

  async getServiceById(id: number) {
    try {
      const service = await this.prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        return { status: 404, message: 'Service not found' };
      }

      return {
        status: 200,
        message: 'Service fetched successfully',
        data: service,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Error fetching service by ID',
        errorStack: error,
        context: 'ServiceService - getServiceById',
      });
    }
  }

  async updateService(id: number, dto: UpdateServiceDto, userId: number) {
    try {
      const existingService = await this.prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return {
          status: 404,
          message: 'Service not found',
        };
      }

      const updated = await this.prisma.service.update({
        where: { id },
        data: { ...dto },
      });

      await this.actionLogger.logAction(
        {
          referenceId: updated.id,
          refereceType: 'SERVICE',
          action: 'UPDATE',
          context: 'ServiceService - updateService',
          description: `Service ${updated.name} updated`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Service updated successfully',
        data: updated,
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Failed to update service',
        errorStack: error,
        context: 'ServiceService - updateService',
      });
    }
  }

  async deleteService(id: number, userId: number) {
    try {
      const service = await this.prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        return { status: 404, message: 'Service not found' };
      }
      const existingService = await this.prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return {
          status: 404,
          message: 'Service not found',
        };
      }
      const deleted = await this.prisma.service.delete({
        where: { id },
      });

      await this.actionLogger.logAction(
        {
          referenceId: deleted.id,
          refereceType: 'SERVICE',
          action: 'DELETE',
          context: 'ServiceService - deleteService',
          description: `Service ${deleted.name} deleted`,
          additionalInfo: null,
        },
        userId,
      );

      return {
        status: 200,
        message: 'Service deleted successfully',
      };
    } catch (error) {
      return this.errorLogger.errorlogger({
        errorMessage: 'Failed to delete service',
        errorStack: error,
        context: 'ServiceService - deleteService',
      });
    }
  }
}
