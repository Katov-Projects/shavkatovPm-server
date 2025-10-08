import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Statistics, StatisticsDocument } from './model';
import { Model } from 'mongoose';
import PDFDocument = require('pdfkit');
import { Writable } from 'stream';
import { Blog, BlogDocument } from '../blog';
import { Category, CategoryDocument } from '../category/model';

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

@Injectable()
export class StatsDataService {
  constructor(
    @InjectModel(Statistics.name)
    private readonly statsModel: Model<StatisticsDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async createPeriodStats(
    timeQuery: PeriodQuery,
    sectionQuery: SectionQuery = 'all',
  ) {
    const now = new Date();
    const startDate = new Date(now);

    switch (timeQuery) {
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'day':
      default:
        startDate.setDate(now.getDate() - 1);
        break;
    }

    const formatDate = (date: Date) =>
      date.toISOString().split('T')[0].split('-').reverse().join('.');

    if (sectionQuery === 'all') {
      const pages = [
        'home',
        'blogs',
        'projects',
        'services',
        'faq',
        'contact',
        'about',
      ];

      const results: any[] = [];

      for (const page of pages) {
        const periodStats = await this.statsModel.find({
          date: { $gte: startDate, $lte: now },
          name: page,
          periodType: 'daily',
        });

        const uniqueDates = new Set(
          periodStats.map((p) => p.date.toISOString().split('T')[0]),
        );

        if (timeQuery === 'week' && uniqueDates.size < 7) {
          continue;
        }

        if (timeQuery === 'month' && uniqueDates.size < 28) {
          console.log(`❌ ${page} uchun to‘liq oylik data yo‘q`);
          continue;
        }

        if (!periodStats.length) continue;

        let totalPageViews = 0;
        let totalAvgTime = 0;
        let totalBounceRate = 0;
        const totalUniqueSet = new Set<string>();

        periodStats.forEach((stat) => {
          stat.trafficSources.forEach((source) => {
            source.uniqueViews.forEach((u) => totalUniqueSet.add(u));
            totalPageViews += source.multiViews || 0;
            totalAvgTime += source.avgTime || 0;
            totalBounceRate += source.bounceRate || 0;
          });
        });

        const totalDocs = periodStats.length;
        const avgTime = totalDocs ? Math.round(totalAvgTime / totalDocs) : 0;
        const avgBounceRate = totalDocs
          ? totalBounceRate
          : 0;

        results.push({
          type:
            timeQuery === 'month'
              ? 'Monthly'
              : timeQuery === 'week'
                ? 'Weekly'
                : 'Daily',
          startDate: formatDate(startDate),
          endDate: formatDate(now),
          page,
          uniqueVisitors: totalUniqueSet.size,
          pageViews: totalPageViews,
          avgTime,
          bounceRate: avgBounceRate,
        });
      }

      return results.length
        ? { name: 'page', data: results }
        : { message: `Not enough data for ${timeQuery} statistics` };
    }

    const stats = await this.statsModel.find({
      createdAt: { $gte: startDate, $lte: now },
      name: sectionQuery,
      periodType: 'daily',
    });

    if (!stats.length)
      return { message: `Not enough data for ${sectionQuery} (${timeQuery})` };

    const trafficMap = new Map<
      string,
      {
        uniqueSet: Set<string>;
        totalViews: number;
        totalAvgTime: number;
        totalBounce: number;
        docs: number;
      }
    >();

    stats.forEach((stat) => {
      stat.trafficSources.forEach((source, key) => {
        const name = key || 'Other';
        if (!trafficMap.has(name)) {
          trafficMap.set(name, {
            uniqueSet: new Set(),
            totalViews: 0,
            totalAvgTime: 0,
            totalBounce: 0,
            docs: 0,
          });
        }
        const item = trafficMap.get(name)!;

        source.uniqueViews.forEach((u) => item.uniqueSet.add(u));
        item.totalViews += source.multiViews || 0;
        item.totalAvgTime += source.avgTime || 0;
        item.totalBounce += source.bounceRate || 0;
        item.docs += 1;
      });
    });

    const result = Array.from(trafficMap.entries()).map(([traffic, val]) => ({
      startDate: formatDate(startDate),
      endDate: formatDate(now),
      trafficSource: traffic,
      uniqueVisitors: val.uniqueSet.size,
      pageViews: val.totalViews,
      avgTime: val.docs ? Math.round(val.totalAvgTime / val.docs) : 0,
      bounceRate: val.docs ? val.totalBounce : 0,
    }));

    return { name: 'traffic Source', data: result };
  }

  async createBlogStats(count = 24, step = 1, categoryName = 'all') {
    const skip = (step - 1) * count;

    if (categoryName === 'all') {
      const totalCount = await this.blogModel.countDocuments();

      const blogs = await this.blogModel
        .find()
        .skip(skip)
        .limit(count)
        .sort({ createdAt: -1 });

      return {
        message: 'success',
        data: blogs,
        meta: {
          totalCount,
          totalPages: Math.ceil(totalCount / count),
          currentStep: step,
          perPage: count,
        },
      };
    }

    const checkCategory = await this.categoryModel.findOne({
      name: categoryName,
    });

    if (!checkCategory) {
      throw new NotFoundException('category not found');
    }

    const foundCategory = await this.categoryModel
      .findById(checkCategory._id)
      .populate({
        path: 'blog',
        options: {
          sort: { createdAt: -1 },
          skip,
          limit: count,
        },
      });

    if (
      !foundCategory ||
      !foundCategory.blog ||
      foundCategory.blog.length === 0
    ) {
      return {
        message: 'not found',
        data: [],
        meta: {
          totalCount: 0,
          totalPages: 0,
          currentStep: step,
          perPage: count,
        },
      };
    }

    const totalCount = await this.blogModel.countDocuments({
      categoryId: checkCategory._id,
    });

    const blogs = foundCategory?.blog ?? [];

    return {
      message: 'success',
      data: blogs,
      meta: {
        totalCount,
        totalPages: Math.ceil(totalCount / count),
        currentStep: step,
        perPage: count,
      },
    };
  }

  async generatePdf(payload: any): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    const stream = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });

    doc.pipe(stream);

    // Extract incoming data shape: { time, section, data }
    const { time, section, data } = payload || {};
    const rows: any[] = Array.isArray(data)
      ? data
      : Array.isArray(payload)
        ? payload
        : Array.isArray(data?.data)
          ? data.data
          : [];

    const firstRow = rows[0] || {};
    const isAll =
      String(section || '').toLowerCase() === 'all' ||
      String(payload?.name || '').toLowerCase() === 'page' ||
      ('page' in firstRow && !('trafficSource' in firstRow));

    // Header
    doc.fontSize(20).text('📊 Traffic Statistics', { align: 'center' });
    doc.moveDown(0.5);
    const subtitleParts: string[] = [];
    if (time) subtitleParts.push(`Time: ${String(time).toUpperCase()}`);
    if (section)
      subtitleParts.push(`Section: ${String(section).toUpperCase()}`);
    doc
      .fontSize(10)
      .fillColor('#555555')
      .text(subtitleParts.join('  |  '), { align: 'center' });
    doc.moveDown(0.5);
    doc
      .fillColor('#000000')
      .fontSize(10)
      .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1.5);

    if (!rows.length) {
      doc.fontSize(12).text('No data available for the selected filters.', {
        align: 'center',
      });
      doc.end();
      return new Promise<Buffer>((resolve, reject) => {
        stream.on('finish', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    }

    // Table layout
    const marginLeft = doc.page.margins.left || 40;
    const marginRight = doc.page.margins.right || 40;
    const pageWidth = doc.page.width;
    const usableWidth = pageWidth - marginLeft - marginRight;

    type Column = {
      header: string;
      keys: string[];
      width: number;
      align?: 'left' | 'right' | 'center';
    };

    const baseColumns: Column[] = [
      { header: 'Start Date', keys: ['startDate', 'start'], width: 0.14 },
      { header: 'End Date', keys: ['endDate', 'end'], width: 0.14 },
      {
        header: isAll ? 'Page' : 'Traffic Source',
        keys: isAll ? ['page'] : ['trafficSource'],
        width: 0.28,
      },
      {
        header: 'Unique Visitors',
        keys: ['uniqueVisitors', 'visitors'],
        width: 0.15,
        align: 'right' as const,
      },
      {
        header: 'Page Views',
        keys: ['pageViews', 'views'],
        width: 0.11,
        align: 'right' as const,
      },
      {
        header: 'Avg. Time (sec)',
        keys: ['avgTime', 'avg'],
        width: 0.1,
        align: 'right' as const,
      },
      {
        header: 'Bounce Rate',
        keys: ['bounceRate', 'bounce'],
        width: 0.08,
        align: 'right' as const,
      },
    ];

    const columns: Column[] = baseColumns.map((c) => ({
      ...c,
      width: Math.floor(c.width * usableWidth),
    }));

    const tableTop = doc.y;
    const rowHeight = 22;
    const headerHeight = 26;
    const cellPaddingH = 6;

    const drawHeader = () => {
      let x = marginLeft;
      doc.save();
      doc
        .fillColor('#f2f2f2')
        .rect(marginLeft, doc.y, usableWidth, headerHeight)
        .fill();
      doc
        .strokeColor('#dddddd')
        .lineWidth(1)
        .rect(marginLeft, doc.y, usableWidth, headerHeight)
        .stroke();
      doc.fillColor('#000000').fontSize(10);

      columns.forEach((col) => {
        const w = col.width as number;
        doc.text(
          col.header,
          x + cellPaddingH,
          tableTop + (headerHeight - 10) / 2 - 1,
          {
            width: w - cellPaddingH * 2,
            align: col.align || 'left',
          },
        );
        x += w;
      });
      doc.restore();
      doc.moveDown(0);
      doc.y = tableTop + headerHeight;
    };

    const ensurePage = (neededHeight: number) => {
      const bottomLimit = doc.page.height - (doc.page.margins.bottom || 40);
      if (doc.y + neededHeight > bottomLimit) {
        doc.addPage();
        // re-draw header on new page
        const newTop = doc.page.margins.top || 40;
        doc.y = newTop;
        drawHeader();
      }
    };

    const getValue = (row: any, keys: string[]): string => {
      for (const k of keys) {
        const v = row?.[k];
        if (v !== undefined && v !== null && String(v).length > 0)
          return String(v);
      }
      return '-';
    };

    // Render table header
    drawHeader();

    // Render rows
    rows.forEach((row) => {
      ensurePage(rowHeight);
      let x = marginLeft;
      const y = doc.y;

      // row background (zebra)
      const zebra =
        Math.floor((y - tableTop - headerHeight) / rowHeight) % 2 === 0;
      if (zebra) {
        doc.save();
        doc
          .fillColor('#fafafa')
          .rect(marginLeft, y, usableWidth, rowHeight)
          .fill();
        doc.restore();
      }

      // cell borders + text
      columns.forEach((col) => {
        const w = col.width as number;
        doc
          .strokeColor('#eeeeee')
          .lineWidth(0.8)
          .rect(x, y, w, rowHeight)
          .stroke();
        const text = getValue(row, col.keys);
        doc
          .fillColor('#000000')
          .fontSize(10)
          .text(text, x + cellPaddingH, y + 6, {
            width: w - cellPaddingH * 2,
            align: col.align || 'left',
            ellipsis: true,
          } as any);
        x += w;
      });

      doc.y = y + rowHeight;
    });

    // finalize
    doc.end();

    return new Promise<Buffer>((resolve, reject) => {
      stream.on('finish', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async generateBlogPdf(payload: any): Promise<Buffer> {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];

    const stream = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(Buffer.from(chunk));
        callback();
      },
    });

    doc.pipe(stream);

    const { name, data } = payload || {};
    const rows: any[] = Array.isArray(data) ? data : [];

    // Header
    doc.fontSize(20).text('📊 Post Statistics', { align: 'center' });
    doc.moveDown(0.5);
    doc
      .fontSize(10)
      .fillColor('#555555')
      .text(`Category: ${(name || 'ALL').toString().toUpperCase()}`, {
        align: 'center',
      });
    doc.moveDown(0.5);
    doc
      .fillColor('#000000')
      .fontSize(10)
      .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1.5);

    if (!rows.length) {
      doc.fontSize(12).text('No data available.', { align: 'center' });
      doc.end();
      return new Promise<Buffer>((resolve, reject) => {
        stream.on('finish', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
      });
    }

    // Table layout
    const marginLeft = doc.page.margins.left || 40;
    const marginRight = doc.page.margins.right || 40;
    const pageWidth = doc.page.width;
    const usableWidth = pageWidth - marginLeft - marginRight;

    type Column = {
      header: string;
      key: string;
      width: number;
      align?: 'left' | 'right' | 'center';
    };

    const baseColumns: Column[] = [
      { header: 'Post Name', key: 'title', width: 0.42 },
      {
        header: 'Unique Visitors',
        key: 'uniqueVisitors',
        width: 0.18,
        align: 'right',
      },
      { header: 'Page Views', key: 'pageViews', width: 0.14, align: 'right' },
      {
        header: 'Avg. Time (sec)',
        key: 'avgTime',
        width: 0.14,
        align: 'right',
      },
      { header: 'Bounce Rate', key: 'bounceRate', width: 0.12, align: 'right' },
    ];

    const columns: Column[] = baseColumns.map((c) => ({
      ...c,
      width: Math.floor(c.width * usableWidth),
    }));

    const headerHeight = 26;
    const rowHeight = 22;
    const cellPaddingH = 6;
    const tableTop = doc.y;

    const drawHeader = () => {
      let x = marginLeft;
      doc.save();
      doc
        .fillColor('#f2f2f2')
        .rect(marginLeft, doc.y, usableWidth, headerHeight)
        .fill();
      doc
        .strokeColor('#dddddd')
        .lineWidth(1)
        .rect(marginLeft, doc.y, usableWidth, headerHeight)
        .stroke();
      doc.fillColor('#000000').fontSize(10);

      columns.forEach((col) => {
        const w = col.width as number;
        doc.text(
          col.header,
          x + cellPaddingH,
          tableTop + (headerHeight - 10) / 2 - 1,
          {
            width: w - cellPaddingH * 2,
            align: col.align || 'left',
          },
        );
        x += w;
      });
      doc.restore();
      doc.y = tableTop + headerHeight;
    };

    const ensurePage = (needed: number) => {
      const bottom = doc.page.height - (doc.page.margins.bottom || 40);
      if (doc.y + needed > bottom) {
        doc.addPage();
        const newTop = doc.page.margins.top || 40;
        doc.y = newTop;
        drawHeader();
      }
    };

    const normalize = (r: any) => ({
      title: r.title,
      uniqueVisitors: Array.isArray(r.uniqueViews)
        ? r.uniqueViews.length
        : (r.uniqueVisitors ?? 0),
      pageViews: r.multiViews ?? r.pageViews ?? 0,
      avgTime: r.avgTime ?? 0,
      bounceRate:
        typeof r.bounceRate === 'number'
          ? `${r.bounceRate}%`
          : (r.bounceRate ?? '0%'),
    });

    drawHeader();

    rows.forEach((raw) => {
      ensurePage(rowHeight);
      const row = normalize(raw);
      let x = marginLeft;
      const y = doc.y;

      const zebra =
        Math.floor((y - tableTop - headerHeight) / rowHeight) % 2 === 0;
      if (zebra) {
        doc.save();
        doc
          .fillColor('#fafafa')
          .rect(marginLeft, y, usableWidth, rowHeight)
          .fill();
        doc.restore();
      }

      columns.forEach((col) => {
        const w = col.width as number;
        doc
          .strokeColor('#eeeeee')
          .lineWidth(0.8)
          .rect(x, y, w, rowHeight)
          .stroke();
        const text = String((row as any)[col.key] ?? '-');
        doc
          .fillColor('#000000')
          .fontSize(10)
          .text(text, x + cellPaddingH, y + 6, {
            width: w - cellPaddingH * 2,
            align: col.align || 'left',
            ellipsis: true,
          } as any);
        x += w;
      });

      doc.y = y + rowHeight;
    });

    doc.end();

    return new Promise<Buffer>((resolve, reject) => {
      stream.on('finish', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
