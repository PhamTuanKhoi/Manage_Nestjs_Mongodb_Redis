import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { CreateCustomerFeedbackDto } from './dto/create-customer-feedback.dto';
import { UpdateCustomerFeedbackDto } from './dto/update-customer-feedback.dto';
import { CustomerFeedback } from './schema/customer-feedback.schema';

@Injectable()
export class CustomerFeedbackService {
  private readonly logger = new Logger(CustomerFeedbackService.name);

  constructor(
    @InjectModel(CustomerFeedback.name) private model: Model<CustomerFeedback>,
    private readonly userService: UserService,
  ) {}

  async create(createCustomerFeedbackDto: CreateCustomerFeedbackDto) {
    try {
      await this.userService.isModelExist(createCustomerFeedbackDto?.clientId);

      const created = await this.model.create({
        ...createCustomerFeedbackDto,
        client: createCustomerFeedbackDto.clientId,
      });

      this.logger.log(`created a new feedback success by id#` + created?._id);

      return created;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  findAll() {
    return this.model.find();
  }

  async findByCustomer(id: string) {
    return this.model.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'client',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: {
          path: '$client',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $expr: {
            $eq: ['$client._id', { $toObjectId: id }],
          },
        },
      },
      {
        $project: {
          _id: '$_id',
          feedback: '$feedback',
          date: '$date',
        },
      },
    ]);
  }

  findById(id: string) {
    return this.model.findById(id).lean();
  }

  async update(
    id: string,
    updateCustomerFeedbackDto: UpdateCustomerFeedbackDto,
  ) {
    try {
      await this.isModelExist(id);

      const updated = await this.model.findByIdAndUpdate(
        id,
        {
          ...updateCustomerFeedbackDto,
          client: updateCustomerFeedbackDto.clientId,
        },
        {
          new: true,
        },
      );

      this.logger.log(
        `updated a customerFeedback success by id #${updated?._id}`,
      );

      return updated;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.model.findByIdAndDelete(id);

      this.logger.log(`delete customerFeedback by id #${deleted?._id}`);

      return deleted;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async isModelExist(id, isOptional = false, msg = '') {
    if (isOptional && !id) return;
    const errorMessage = msg || `id-> ${CustomerFeedback.name} not found`;
    const isExist = await this.findById(id);
    if (!isExist) throw new Error(errorMessage);
  }
}
