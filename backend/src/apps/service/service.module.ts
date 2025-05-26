import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RedisModule } from 'src/modules/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [ServiceController],
  providers: [ServiceService, PrismaService],
})
export class ServiceModule {}
