import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { ProjectServiec } from "./project.servoce";
import { CreateProjectDto, UpdateProjectDto } from "./dtos";
import { Protected } from "src/decoratores";

@Controller('project')
export class ProjectController {
  constructor(private readonly service: ProjectServiec) {}

  @Get('all')
  @Protected(false)
  async getAllProject() {
    return await this.service.getAll();
  }

  @Get('archive')
  @Protected(true)
  async getAllArchive() {
    return await this.service.getAllArchive();
  }

  @Get(":id")
  @Protected(false)
  async getById(@Param("id") id: string) {
    return await this.service.getById(id);
  }

  @Post('create')
  @Protected(true)
  async createProject(@Body() body: CreateProjectDto) {
    return await this.service.create(body);
  }

  @Put('update/:id')
  @Protected(true)
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    return await this.service.update(id, body);
  }

  @Patch('archive/:id')
  @Protected(true)
  async makeArchive(@Param('id') id: string) {
    return await this.service.makeArchive(id);
  }

  @Patch('unarchive/:id')
  @Protected(true)
  async exitArchive(@Param('id') id: string) {
    return await this.service.exitArchive(id);
  }

  @Delete(':id')
  @Protected(true)
  async delete(@Param('id') id: string) {
    return await this.service.detete(id);
  }
}