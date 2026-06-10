import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsString()
  ownerName: string;

  @IsOptional()
  @IsString()
  tenantName?: string;

  @IsString()
  address: string;

  @IsString()
  propertyType: string;

  @IsNumber()
  rentAmount: number;

  @IsString()
  status: string;

  @IsBoolean()
  furnished: boolean;
}
