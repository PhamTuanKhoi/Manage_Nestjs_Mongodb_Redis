import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerFeedbackDto {
  @IsOptional()
  @IsString()
  feedback: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;
}
