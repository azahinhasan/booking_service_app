import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { RedisModule } from '../../modules/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [ServiceController],
  providers: [ServiceService, PrismaService],
})
export class ServiceModule {}
