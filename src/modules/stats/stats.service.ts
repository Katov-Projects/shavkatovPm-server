import { InjectModel } from '@nestjs/mongoose';
import { Statistics, StatisticsDocument } from './model';
import { Model } from 'mongoose';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Socket } from "socket.io-client";

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Statistics.name)
    private readonly statisticModel: Model<StatisticsDocument>,
  ) {}

  async statisticEvent(payload: any, soket: Server, client: Socket) {
    console.log(payload, client.id);
    return {
      message: 'success',
    };
  }
}
