import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMaintenanceDto {
  @IsString()
  propertyId: string;

  @IsString()
  propertyType: string;

  @IsString()
  description: string;

  @IsString()
  area: string;

  @IsNumber()
  cost: number;

  @IsString()
  responsible: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  nextServiceDate?: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  evidenceFileUrl?: string;
}
