import { Module } from '@nestjs/common';
import { AuthModule } from './apps/auth/auth.module';
import { ServiceModule } from './apps/service/service.module';
import { ServiceBookingModule } from './apps/service-booking/service-booking.module';


import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SharedModule } from './modules/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ServiceModule,
    ServiceBookingModule,
    PrismaModule,
    SharedModule
  ],
  providers: [AuthModule,PrismaModule],
})
export class AppModule {}
