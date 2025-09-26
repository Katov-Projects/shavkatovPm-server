import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto, UpdateBlogDto } from "./dtos";
import { Protected } from "src/decoratores";


@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get('all')
  @Protected(false)
  async getAll() {
    return await this.service.getAll();
  }

  @Get('all-archive')
  @Protected(true)
  async getAllArchive() {
    return await this.service.getArchive();
  }

  @Get('getById/:id')
  @Protected(false)
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post('create')
  @Protected(true)
  async create(@Body() body: CreateBlogDto) {
    return await this.service.create(body);
  }

  @Put('update/:id')
  @Protected(true)
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogDto) {
    return await this.service.updateBlog(id, body);
  }

  @Patch('make-archive/:id')
  @Protected(true)
  async makeArchive(@Param('id') id: string) {
    return await this.service.makeArchive(id);
  }

  @Patch('exit-archive/:id')
  @Protected(true)
  async exitArchive(@Param('id') id: string) {
    return await this.service.exitArchive(id);
  }

  @Delete("delete/:id")
  @Protected(true)
  async delete (@Param("id") id:string) {
    return await this.service.detete(id);
  }
}