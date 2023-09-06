import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { CreateJoinProjectDto } from './dto/create-join-project.dto';
import { UpdateJoinProjectDto } from './dto/update-join-project.dto';
import { JoinProject, JoinProjectDocument } from './schema/join-project.schema';

@Injectable()
export class JoinProjectService {
  private readonly logger = new Logger(JoinProjectService.name);

  constructor(
    @InjectModel(JoinProject.name) private model: Model<JoinProjectDocument>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async findById(id: string) {
    return this.model.findById(id).lean();
  }

  async findByProjectIdAndWorkerId(projectId: string, workerId: string) {
    return this.model.find({ project: projectId, joinor: workerId });
  }

  async create(createJoinProjectDto: CreateJoinProjectDto) {
    try {
      // check input data
      await Promise.all([
        this.userService.isModelExist(createJoinProjectDto.joinor),
        this.projectService.isModelExist(createJoinProjectDto.project),
      ]);

      const created = await this.model.create(createJoinProjectDto);

      this.logger.log(`created a new join-project by id#${created?._id}`);

      return created;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async updateStatus(projectId: string, workerId: string) {
    try {
      const join = await this.findByProjectIdAndWorkerId(projectId, workerId);

      if (join?.length < 0)
        throw new HttpException(
          `worker not join project`,
          HttpStatus.NOT_FOUND,
        );

      if (!join[0]?._id)
        throw new HttpException(`join id incorrect`, HttpStatus.NOT_FOUND);

      const updated_status = await this.model.findByIdAndUpdate(
        join[0]?._id,
        { status: false },
        { new: true },
      );

      this.logger.log(
        `updated sattus project success by id#` + updated_status?._id,
      );

      return updated_status;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async premiumsInsurance(id, payload: { premiums: string }) {
    try {
      const join = await this.model.findById(id).lean();

      if (!join)
        throw new HttpException(
          `joinproject not found -> id`,
          HttpStatus.NOT_FOUND,
        );

      const updated = await this.model.findByIdAndUpdate(
        id,
        { premiumsInsurance: payload.premiums },
        { new: true },
      );

      this.logger.log(
        `updated a premiumsInsurance to ${updated?.premiumsInsurance} by id#${updated?._id}`,
      );

      return updated;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async deleteSubportUpdateProject(projectId: string, role: string) {
    try {
      const removed = await this.model.remove({ project: projectId, role });

      this.logger.log(`remove a join project success by id#`);

      return removed;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async isModelExist(id, isOptional = false, msg = '') {
    if (isOptional && !id) return;
    const errorMessage = msg || `id-> ${JoinProject.name} not found`;
    const isExist = await this.findById(id);
    if (!isExist) throw new Error(errorMessage);
  }
}
