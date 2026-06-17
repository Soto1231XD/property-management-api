import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateLeaseDto {
  @IsString()
  propertyId: string;

  @IsString()
  ownerName: string;

  @IsString()
  tenantName: string;

  @IsDateString()
  contractStartDate: string;

  @IsDateString()
  contractEndDate: string;

  @IsNumber()
  monthlyRent: number;

  @IsNumber()
  commission: number;

  @IsOptional()
  @IsNumber()
  rentDiscount?: number;

  @IsOptional()
  @IsString()
  discountDetail?: string;

  @IsBoolean()
  renewal: boolean;

  @IsBoolean()
  requiresInvoice: boolean;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  contractFileUrl?: string;
}
