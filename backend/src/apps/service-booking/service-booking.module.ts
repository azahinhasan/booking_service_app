import { Module } from '@nestjs/common';
import { ServiceBookingController } from './service-booking.controller';
import { ServiceBookingService } from './service-booking.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RedisModule } from 'src/modules/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [ServiceBookingController],
  providers: [ServiceBookingService, PrismaService],
})
export class ServiceBookingModule {}
