import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Protected } from '../../decoratores';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  @Protected(false)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('with-count')
  @Protected(false)
  async getAllCategoryByCount() {
    return await this.categoryService.getAllCategoryByCount();
  }

  @Get('all-cateorynames')
  @Protected(true)
  async getAllCategoryNames() {
    return await this.categoryService.getAllCategoryNames();
  }

  @Get('get-blogs/:id')
  @Protected(false)
  async getByBlogs(@Param('id') id: string) {
    return await this.categoryService.getByBlogs(id);
  }

  @Get(':id')
  @Protected(false)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Post('create')
  @Protected(true)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Patch(':id')
  @Protected(true)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Protected(true)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
