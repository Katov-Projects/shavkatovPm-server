import { InjectModel } from '@nestjs/mongoose';
import {
  BlogStats,
  BlogStatsDocument,
  Statistics,
  StatisticsDocument,
  UserStats,
  UserStatsDocument,
} from './model';
import { isValidObjectId, Model } from 'mongoose';
import { Server } from 'socket.io';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { HomeSection, IBlogStats } from './interface';
import { Blog, BlogDocument } from '../blog';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Statistics.name)
    private readonly statisticModel: Model<StatisticsDocument>,
    @InjectModel(UserStats.name)
    private readonly userModel: Model<UserStatsDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(BlogStats.name)
    private readonly blogStatsModel: Model<BlogStatsDocument>,
  ) {}

  private async getOrCreateStatistic(sectionName: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    let stat = await this.statisticModel.findOne({
      name: sectionName,
      date: { $gte: today, $lt: tomorrow },
    });

    if (!stat) {
      stat = await this.statisticModel.create({
        name: sectionName,
        periodType: 'daily',
        date: today,
      });
    }

    return stat;
  }

  async homeSection(payload: HomeSection, soket: Server, client: Socket) {
    const socketId = client.id;
    console.log(socketId, payload);

    const handshake: any = client.handshake;
    const reqIp: string =
      (Array.isArray(handshake.headers['x-forwarded-for'])
        ? handshake.headers['x-forwarded-for'][0]
        : handshake.headers['x-forwarded-for']) ||
      handshake.address ||
      client.conn.remoteAddress ||
      'unknown';

    try {
      if (payload.event === 'enter') {
        const existing = await this.userModel.findOne({ socketId });

        if (existing) {
          const prevDiffMs =
            new Date(payload.time).getTime() -
            new Date(existing.enterTime).getTime();
          const prevDiffSeconds = Math.floor(prevDiffMs / 1000);

          const prevTraffic = payload.traffic ?? 'direct';
          const prevStat = await this.getOrCreateStatistic(existing.section);
          await this.updateTrafficStats(
            prevStat,
            prevTraffic,
            reqIp,
            prevDiffSeconds,
          );

          await this.userModel.findByIdAndDelete(existing._id);
        }

        await this.userModel.create({
          socketId,
          section: payload.name,
          enterTime: payload.time,
          traffic: payload.traffic,
        });
      } else if (payload.event === 'leave') {
        const findUser = await this.userModel.findOne({ socketId: client.id });
        if (findUser) {
          const diffMs =
            new Date(payload.time).getTime() -
            new Date(findUser.enterTime).getTime();

          const diffSeconds = Math.floor(diffMs / 1000);

          const traffic = payload.traffic;

          if (
            ![
              'google',
              'yandex',
              'direct',
              'telegram',
              'instagram',
              'other',
            ].includes(traffic)
          ) {
            return { message: 'invalid traffic source' };
          }
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          const findStatistic = await this.statisticModel.findOne({
            name: payload.name,
            date: { $gte: today, $lt: tomorrow },
          });

          if (findStatistic) {
            await this.updateTrafficStats(
              findStatistic,
              traffic,
              reqIp,
              diffSeconds,
            );
          } else {
            const newStatistic = await this.statisticModel.create({
              name: payload.name,
              periodType: 'daily',
              date: today,
            });
            await this.updateTrafficStats(
              newStatistic,
              traffic,
              reqIp,
              diffSeconds,
            );
          }

          await this.userModel.findOneAndUpdate(
            { socketId: socketId },
            { enterTime: payload.time },
          );
        }
      }
    } catch (error) {
      console.log(error, 'error homeSection');
    }

    return {
      message: 'success',
    };
  }

  async updateTrafficStats(
    model: StatisticsDocument,
    traffic: string,
    reqIp: string,
    seconds: number,
  ) {
    let trafficStats = model.trafficSources.get(traffic);

    if (!trafficStats) {
      trafficStats = {
        uniqueViews: [],
        uniqueCount: 0,
        multiViews: 0,
        avgTime: 0,
        bounceRate: 0,
      };
    }

    if (trafficStats) {
      trafficStats.multiViews += 1;

      if (!trafficStats.uniqueViews.includes(reqIp)) {
        trafficStats.uniqueViews.push(reqIp);
        trafficStats.uniqueCount += 1;
      }

      const currentAvg = trafficStats.avgTime || 0;
      const count = trafficStats.multiViews || 0;

      const newAvg = (currentAvg * count + seconds) / (count + 1);

      trafficStats.avgTime = newAvg;
    }
    model.trafficSources.set(traffic, trafficStats);

    await model.save();
  }

  async handleDisconnect(client: Socket) {
    try {
      const data = await this.userModel.findOne({ socketId: client.id });
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (data) {
        const stats = await this.statisticModel.findOne({
          name: data.section,
          date: today,
        });
        if (stats) {
          const allStats = await this.statisticModel.find({ date: today });

          const pages = [
            'google',
            'yandex',
            'telegram',
            'instagram',
            'other',
            'direct',
          ];

          let allWiewCount: number = 0;
          let avgTime: number = 0;
          let allBounceRate: number = 0;

          for (let i = 0; i < allStats.length; i++) {
            const trafficMap = allStats[i].trafficSources;
            for (let page of pages) {
              const views = trafficMap.get(page)?.multiViews || 0;
              allWiewCount += views;
              avgTime += trafficMap.get(page)?.avgTime || 0;
              allBounceRate += trafficMap.get(page)?.bounceRate || 0;
            }
          }

          const leaveTime = new Date().toISOString();
          const diffMs =
            new Date(leaveTime).getTime() - new Date(data.enterTime).getTime();

          const diffSeconds = Math.floor(diffMs / 1000);

          const traffic = stats.trafficSources.get(data.traffic);

          if (traffic) {
            const oldAvg = traffic.avgTime || 0;
            const oldBounce = traffic.bounceRate || 0;

            const newAvg = oldAvg + diffSeconds;

            traffic.avgTime = newAvg;
            traffic.bounceRate = oldBounce + 1;
          }
          await stats.save();
        }
      }

      await this.userModel.findOneAndDelete({ socketId: client.id });
    } catch (error) {
      console.error(error, 'disconnent error');
    }

    return {
      message: 'success',
    };
  }

  async blogStats(payload: IBlogStats, client: Socket) {
    console.log(payload, client.id, 'kirdi');
    if (!isValidObjectId(payload.blogId)) {
      return {
        message: 'error format ID',
      };
    }
    try {
      const socketId = client.id;

      if (payload.event === 'enter') {
        await this.blogStatsModel.deleteMany({ socketId });

        await this.blogStatsModel.create({
          socketId,
          blogId: payload.blogId,
          enterTime: payload.time,
        });
      } else if (payload.event === 'leave') {
        const foundBlogStats = await this.blogStatsModel.findOne({
          socketId: socketId,
        });

        if (foundBlogStats) {
          const foundBlog = await this.blogModel.findById(payload.blogId);

          if (foundBlog) {
            const diffMs =
              new Date(payload.time).getTime() -
              new Date(foundBlogStats.enterTime).getTime();

            const diffSeconds = Math.floor(diffMs / 1000);

            const currentAvg = foundBlog.avgTime || 0;
            const count = foundBlog.multiViews || 0;

            const newAvg = (currentAvg * count + diffSeconds) / (count + 1);

            foundBlog.avgTime = newAvg;

            if (diffSeconds <= 10) {
              foundBlog.bounceRate = (foundBlog.bounceRate || 0) + 1;
            }

            await foundBlog.save();
          }

          await this.blogStatsModel.findByIdAndDelete(foundBlogStats._id);
        }
      }
    } catch (error) {
      console.error('blogStats', error);
    }

    return {
      message: 'success',
    };
  }
}
