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
import { ServiceService } from './service.service';
import { CreateServiceDto, UpdateServiceDto } from './service.dto';
import { Response } from 'express';
import { AuthGuard, RolesGuard } from '../../guards';
import { Roles } from '../../decorators/roles.decorator';
import { GetIssuer } from '../../decorators';
import { PaginationDto } from '../../lib/dtos/pagination.dto';
import { Users } from '@prisma/client';

const allowedRolesMutation = [
  { role: 'MANAGER', context: 'MT' },
  { role: 'ADMIN', context: 'MT' },
  { role: 'DEVELOPER', context: 'MT' },
];

@Controller('services')
@Roles(...allowedRolesMutation)
export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(
    @Body() dto: CreateServiceDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.serviceService.createService(dto, issuer.id);
    return res.status(result.status).json(result);
  }

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.serviceService.getAllServices(pagination);
    return res.status(result.status).json(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const result = await this.serviceService.getServiceById(Number(id));
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateServiceDto,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.serviceService.updateService(Number(id), dto, issuer.id);
    return res.status(result.status).json(result);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @GetIssuer() issuer: Users,
    @Res() res: Response,
  ) {
    const result = await this.serviceService.deleteService(Number(id), issuer.id);
    return res.status(result.status).json(result);
  }
}
