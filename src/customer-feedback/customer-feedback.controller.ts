import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerFeedbackService } from './customer-feedback.service';
import { CreateCustomerFeedbackDto } from './dto/create-customer-feedback.dto';
import { UpdateCustomerFeedbackDto } from './dto/update-customer-feedback.dto';

@Controller('customer-feedback')
export class CustomerFeedbackController {
  constructor(
    private readonly customerFeedbackService: CustomerFeedbackService,
  ) {}

  @Post()
  create(@Body() createCustomerFeedbackDto: CreateCustomerFeedbackDto) {
    return this.customerFeedbackService.create(createCustomerFeedbackDto);
  }

  @Get()
  findAll() {
    return this.customerFeedbackService.findAll();
  }

  @Get('customer/:id')
  findByCustomer(@Param('id') id: string) {
    return this.customerFeedbackService.findByCustomer(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerFeedbackService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerFeedbackDto: UpdateCustomerFeedbackDto,
  ) {
    return this.customerFeedbackService.update(id, updateCustomerFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerFeedbackService.remove(id);
  }
}
