import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  propertyId: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @IsString()
  month: string;

  @IsInt()
  year: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  accessRenewal?: string;

  @IsOptional()
  @IsString()
  accessType?: string;

  @IsOptional()
  @IsString()
  accessManagement?: string;

  @IsString()
  serviceValidation: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  receiptFileUrl?: string;
}
