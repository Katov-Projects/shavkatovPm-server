import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './model';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProjectDto, UpdateProjectDto } from './dtos';

@Injectable()
export class ProjectServiec {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async getAll() {
    const data = await this.projectModel.find({ isArchive: false });

    return {
      message: 'success',
      data: data,
    };
  }

  async getAllArchive() {
    const data = await this.projectModel.find({ isArchive: true });

    return {
      message: 'success',
      data: data,
    };
  }

  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Noto‘g‘ri ID format');
    }

    const foundProject = await this.projectModel.findById(id);

    if (!foundProject) {
      throw new NotFoundException('Project topilmadi');
    }

    return {
      message: 'success',
      data: foundProject,
    };
  }

  async create(payload: CreateProjectDto) {
    const foundProject = await this.projectModel.findOne({
      title: payload.title.trim(),
    });

    if (foundProject) {
      throw new ConflictException('Project Allaqajon Mavjud');
    }

    const data = await this.projectModel.create({
      title: payload.title,
      subtitle: payload.subtitle,
      maqsad: payload.maqsad,
      yondashuv: payload.yondashuv,
      vositalar: payload.vositalar,
      url: payload.url,
    });

    return {
      message: 'success',
      data,
    };
  }

  async update(id: string, payload: UpdateProjectDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Noto'g'ri ID format");
    }

    const update = await this.projectModel.findOneAndUpdate(
      { title: payload.title },
      {
        title: payload.title,
        subtitle: payload.subtitle,
        maqsad: payload.maqsad,
        yondashuv: payload.yondashuv,
        vositalar: payload.vositalar,
        url: payload.url,
      },
      { new: true, runValidators: true },
    );

    if (!update) {
      throw new NotFoundException('Project Topilmadi');
    }

    return {
      message: 'success',
      data: update,
    };
  }

  async makeArchive(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Noto‘g‘ri ID format');
    }

    const data = await this.projectModel.findById(id);

    if (data?.isArchive === true) {
      throw new BadRequestException('Bu project allaqachon arxivda');
    }

    const foundBlog = await this.projectModel.findByIdAndUpdate(
      id,
      { isArchive: true },
      { new: true },
    );
    if (!foundBlog) {
      throw new NotFoundException('Project Tobilmadi');
    }

    return {
      message: 'success',
    };
  }

  async exitArchive(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Noto'g'ri ID format");
    }

    const data = await this.projectModel.findById(id);

    if (data?.isArchive === false) {
      throw new BadRequestException('Bu project allaqachon arxivdan chiqgan');
    }

    const foundBlog = await this.projectModel.findByIdAndUpdate(
      id,
      { isArchive: false },
      { new: true },
    );
    if (!foundBlog) {
      throw new NotFoundException('Project Tobilmadi');
    }

    return {
      message: 'success',
    };
  }

  async detete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Noto'g'ri ID format");
    }

    const deleted = await this.projectModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Project topilmadi');
    }

    return {
      message: 'success',
    };
  }
}
