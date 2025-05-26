// create-service.dto.ts
import { IsString, IsOptional, IsNumber, IsBoolean,Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  @Min(0, { message: 'Price cannot be less than 0' }) 
  price: number;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}


export class UpdateServiceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
