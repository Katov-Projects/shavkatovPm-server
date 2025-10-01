import { Module } from "@nestjs/common";
import { StatsController } from "./stats.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Statistics, StatisticsSchema } from "./model";
import { StatsService } from "./stats.service";
import { StatsGataway } from "./stats.gateway";


@Module({
  imports: [
    MongooseModule.forFeature([{name: Statistics.name, schema: StatisticsSchema}])
  ],
  controllers: [StatsController],
  providers: [StatsService, StatsGataway]
})

export class StatsModule {}