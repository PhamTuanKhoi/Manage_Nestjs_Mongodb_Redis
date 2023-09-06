import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type CustomerFeedbackDocument = HydratedDocument<CustomerFeedback>;

@Schema({
  timestamps: true,
})
export class CustomerFeedback {
  @Prop()
  feedback: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  client: User;

  @Prop({ default: Date.now() })
  date: number;
}

export const CustomerFeedbackSchema =
  SchemaFactory.createForClass(CustomerFeedback);
