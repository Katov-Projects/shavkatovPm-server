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
import { Protected } from 'src/decoratores';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  @Protected(false)
  findAll() {
    return this.categoryService.findAll();
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
