import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  propertyId: string;

  @IsString()
  month: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsString()
  paymentMethod: string;

  @IsBoolean()
  requiresInvoice: boolean;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  receiptFileUrl?: string;
}
