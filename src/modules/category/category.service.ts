import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './model';
import { isValidObjectId, Model, Types } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async findAll() {
    const data = await this.categoryModel.find();
    return {
      message: 'success',
      data: data,
    };
  }
  async getAllCategoryNames() {
    const data = await this.categoryModel.find({}, { name: 1, _id: 0 });
    console.log(data)
    return {
      message: 'success',
      data: data.map((item) => item.name),
    };
  }

  async getByBlogs(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Error Format ID');
    }

    const foundCategory = await this.categoryModel
      .findById(id)
      .populate('blog');

    if (!foundCategory) {
      throw new NotFoundException('Category Not Found');
    }

    return {
      message: 'success',
      data: foundCategory,
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Error format ID');
    }

    const data = await this.categoryModel.findById(id);

    if (!data) {
      throw new NotFoundException('Category Not Found');
    }

    return {
      message: 'success',
      data,
    };
  }

  async getAllCategoryByCount() {
    const data = await this.categoryModel.aggregate([
      {
        $lookup: {
          from: 'blog',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'blog',
        },
      },
      {
        $addFields: {
          blogCount: { $size: '$blog' },
        },
      },
      {
        $project: {
          blogs: 0,
        },
      },
    ]);

    return {
      message: 'success',
      data,
    };
  }

  async create(payload: CreateCategoryDto) {
    const foundCategory = await this.categoryModel.findOne({
      name: payload.name,
    });

    if (foundCategory) {
      throw new ConflictException('Bunday Category allaqachon yaratilgan');
    }

    const data = await this.categoryModel.create({
      name: payload.name,
    });

    return {
      message: 'success',
      data,
    };
  }

  async update(id: string, payload: UpdateCategoryDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Error format ID');
    }

    const foundCategory = await this.categoryModel.findOne({
      name: payload.name,
    });

    if (foundCategory) {
      throw new ConflictException('Error Format ID');
    }

    const data = await this.categoryModel.updateOne(
      { _id: id },
      {
        name: payload.name,
      },
    );

    return {
      message: 'success',
      data,
    };
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Error format ID');
    }

    const data = await this.categoryModel.findByIdAndDelete(id);

    if (!data) {
      throw new NotFoundException('Category topilmadi');
    }

    return {
      message: 'success',
    };
  }
}
