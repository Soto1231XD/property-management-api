import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  propertyId: string;

  @IsString()
  category: string;

  @IsString()
  concept: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  paymentStatus: string;

  @IsOptional()
  @IsDateString()
  paymentDueDate?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  receiptFileUrl?: string;
}
