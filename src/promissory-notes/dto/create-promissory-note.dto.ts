import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePromissoryNoteDto {
  @IsString()
  propertyId: string;

  @IsString()
  noteNumber: string;

  @IsNumber()
  totalNotes: number;

  @IsString()
  tenantName: string;

  @IsString()
  debtorName: string;

  @IsString()
  payTo: string;

  @IsString()
  address: string;

  @IsString()
  debtorAddress: string;

  @IsString()
  phone: string;

  @IsString()
  relatedService: string;

  @IsString()
  coveredMonth: string;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  interestRate: number;

  @IsString()
  city: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  documentFileUrl?: string;
}
