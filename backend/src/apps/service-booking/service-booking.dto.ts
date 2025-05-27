import { IsString, IsOptional, IsNumber, IsEnum,IsPhoneNumber, IsEmail } from 'class-validator';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class CreateServiceBookingDto {
  @IsString()
  customerName: string;

  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsString()
  @IsEmail()
  email: string;
  
  @IsNumber()
  serviceId: number;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}

export class UpdateServiceBookingDto {
  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsNumber()
  @IsOptional()
  serviceId?: number;

  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;
}
