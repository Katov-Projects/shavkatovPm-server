import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { StatsDataService } from './stats.data.service';
import { Response } from 'express';
import { Protected } from '../../decoratores';

type PeriodQuery = 'day' | 'week' | 'month';
type SectionQuery =
  | 'home'
  | 'blogs'
  | 'projects'
  | 'services'
  | 'faq'
  | 'contact'
  | 'about'
  | 'all';

@Controller('statistics')
export class StatsController {
  constructor(private readonly service: StatsDataService) {}

  @Get()
  @Protected(true)
  async getAll(
    @Query('time') time: PeriodQuery,
    @Query('section') section: SectionQuery,
  ) {
    return await this.service.createPeriodStats(time, section);
  }

  @Post('pdf')
  @Protected(true)
  async generatePdf(@Body() body: any, @Res() res: Response) {
    const pdfBuffer = await this.service.generatePdf(body);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=statistics.pdf');
    res.send(pdfBuffer);
  }

  @Get('blog-stats')
  @Protected(true)
  async getBlogStats(
    @Query('count') count: string,
    @Query('step') step: string,
    @Query('name') name: string,
  ) {
    const parsedCount = Number(count) || 24;
    const parsedStep = Number(step) || 1;
    const categoryName = name || 'all';
    return await this.service.createBlogStats(
      parsedCount,
      parsedStep,
      categoryName,
    );
  }

  @Post('blog-pdf')
  @Protected(true)
  async genertaeBlogPdf(@Body() body: any, @Res() res: Response) {
    const pdfBuffer = await this.service.generateBlogPdf(body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=post-statistics.pdf',
    );
    res.send(pdfBuffer);
  }
}
