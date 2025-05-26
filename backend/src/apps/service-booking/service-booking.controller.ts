import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceBookingService } from './service-booking.service';
import { CreateServiceBookingDto, UpdateServiceBookingDto } from './service-booking.dto';
import { PaginationDto } from '../../lib/dtos/pagination.dto';
import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from '../../decorators/roles.decorator';
import { GetIssuer } from '../../decorators';
import { Users } from '@prisma/client';

const allowedRolesMutation = [
  { role: 'MANAGER', context: 'MT' },
  { role: 'ADMIN', context: 'MT' },
  { role: 'DEVELOPER', context: 'MT' },
];

@Controller('service-bookings')
@Roles(...allowedRolesMutation)
export class ServiceBookingController {
  constructor(private readonly serviceBookingService: ServiceBookingService) {}

  @Post()
  async create(
    @Body() dto: CreateServiceBookingDto,
    @Res() res: Response,
  ) {
    const result = await this.serviceBookingService.createBooking(dto);
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.serviceBookingService.getAllBookings(pagination);
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.serviceBookingService.getBookingById(Number(id));
    return res.status(result.status).json(result);
  }
  
  @Get('get-status/:id')
  async getStatusById(@Param('id') id: number, @Res() res: Response) {
    const result = await this.serviceBookingService.getStatusById(Number(id));
    return res.status(result.status).json(result);
  }


  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateServiceBookingDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.serviceBookingService.updateBooking(Number(id), dto, issuer.id);
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.serviceBookingService.deleteBooking(Number(id), issuer.id);
    return res.status(result.status).json(result);
  }
}
