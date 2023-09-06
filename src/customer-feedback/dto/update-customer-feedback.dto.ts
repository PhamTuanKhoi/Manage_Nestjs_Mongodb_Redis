import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerFeedbackDto } from './create-customer-feedback.dto';

export class UpdateCustomerFeedbackDto extends PartialType(CreateCustomerFeedbackDto) {}
