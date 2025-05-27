import { Module } from '@nestjs/common';
import { ServiceBookingController } from './service-booking.controller';
import { ServiceBookingService } from './service-booking.service';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { RedisModule } from '../../modules/redis/redis.module';
import { EmailService } from 'utils/email';

@Module({
  imports: [RedisModule],
  controllers: [ServiceBookingController],
  providers: [ServiceBookingService, PrismaService,EmailService],
})
export class ServiceBookingModule {}
