import { Module } from '@nestjs/common';
import { CustomerFeedbackService } from './customer-feedback.service';
import { CustomerFeedbackController } from './customer-feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomerFeedback,
  CustomerFeedbackSchema,
} from './schema/customer-feedback.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: CustomerFeedback.name, schema: CustomerFeedbackSchema },
    ]),
  ],
  controllers: [CustomerFeedbackController],
  providers: [CustomerFeedbackService],
})
export class CustomerFeedbackModule {}
