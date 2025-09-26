import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './model';
import { isValidObjectId, Model } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto, UpdateBlogDto } from './dtos';
import { Category, CategoryDocument } from '../category/model';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async getAll() {
    const data = await this.blogModel.find({ isArchive: false });

    return {
      message: 'success',
      data,
    };
  }

  async getArchive() {
    const data = await this.blogModel.find({ isArchive: true });
    return {
      message: 'success',
      data,
    };
  }

  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Noto‘g‘ri ID format');
    }

    const foundBlog = await this.blogModel.findById(id);

    if (!foundBlog) {
      throw new NotFoundException('Blog topilmadi');
    }

    return {
      message: 'success',
      blog: foundBlog,
    };
  }

  async create(payload: CreateBlogDto) {
    if (!isValidObjectId(payload.categoryId)) {
      throw new BadRequestException('Error Format ID');
    }

    const foundCategory = await this.categoryModel.findById(payload.categoryId);

    if (!foundCategory) {
      throw new BadRequestException('Bunday kategory topilmadi');
    }

    try {
      await this.blogModel.create({
        title: payload.header.title,
        subtitle: payload.header.subtitle,
        sections: payload.sections,
        tags: payload.tags,
        seo: payload.seo,
        categoryId: foundCategory._id,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Blog yaratishda xatolik');
    }

    return {
      message: 'success',
    };
  }

  async updateBlog(id: string, payload: UpdateBlogDto) {
    if (!isValidObjectId(id) || !isValidObjectId(payload.categoryId)) {
      throw new BadRequestException('Noto‘g‘ri ID format');
    }

    const foundCategory = await this.categoryModel.findById(payload.categoryId);

    if (!foundCategory) {
      throw new BadRequestException('Bunday kategory topilmadi');
    }


    const update = await this.blogModel.findByIdAndUpdate(
      id,
      {
        title: payload.header.title,
        subtitle: payload.header.subtitle,
        sections: payload.sections,
        tags: payload.tags,
        seo: payload.seo,
        categoryId: foundCategory._id
      },
      { new: true, runValidators: true },
    );

    if (!update) {
      throw new NotFoundException('Blog Topilmadi');
    }

    return {
      message: 'success',
      blog: update,
    };
  }

  async makeArchive(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Noto‘g‘ri ID format');
    }

    const data = await this.blogModel.findById(id);

    if (data?.isArchive === true) {
      throw new BadRequestException('Bu blog allaqachon arxivda');
    }

    const foundBlog = await this.blogModel.findByIdAndUpdate(
      id,
      { isArchive: true },
      { new: true },
    );
    if (!foundBlog) {
      throw new NotFoundException('Blog Tobilmadi');
    }

    return {
      message: 'success',
    };
  }

  async exitArchive(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Noto'g'ri ID format");
    }

    const data = await this.blogModel.findById(id);

    if (data?.isArchive === false) {
      throw new BadRequestException('Bu blog allaqachon archivedan chiqgan');
    }

    const foundBlog = await this.blogModel.findByIdAndUpdate(
      id,
      { isArchive: false },
      { new: true },
    );
    if (!foundBlog) {
      throw new NotFoundException('Blog Tobilmadi');
    }

    return {
      message: 'success',
    };
  }

  async detete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Noto'g'ri ID format");
    }

    const deleted = await this.blogModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Blog topilmadi');
    }

    return {
      message: 'success',
    };
  }
}
