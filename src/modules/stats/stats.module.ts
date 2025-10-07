import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlogStats,
  BlogStatsSchema,
  Statistics,
  StatisticsSchema,
  UserStats,
  UserStatsSchema,
} from './model';
import { StatsService } from './stats.service';
import { StatsGataway } from './stats.gateway';
import { Blog, BlogSchema } from '../blog';
import { StatsDataService } from './stats.data.service';
import { Category, CategorySchema } from '../category/model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Statistics.name, schema: StatisticsSchema },
      { name: UserStats.name, schema: UserStatsSchema },
      { name: BlogStats.name, schema: BlogStatsSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService, StatsGataway, StatsDataService],
})
export class StatsModule {}
