import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export interface FaqItem {
  id: string;
  title: string;
  content: string;
}

export type SettingsDocument = Settings & Document;

@Schema({ collection: 'settings', timestamps: true, versionKey: false })
export class Settings {
  @Prop({
    type: SchemaTypes.String,
    enum: ['newest', 'oldest', 'mostViewed'],
    default: 'newest',
  })
  blogSortBy: string;

  @Prop({
    type: SchemaTypes.String,
    default: 'Hammasi IT Loyiha boshqaruvi haqida',
  })
  heroTitle: string;

  @Prop({
    type: SchemaTypes.String,
    default: 'Tartibli boshqaruv',
  })
  heroSubtitleOne: string;

  @Prop({
    type: SchemaTypes.String,
    default: 'Kafolatlangan samaradorlik.',
  })
  heroSubtitleTwo: string;

  @Prop({
    type: SchemaTypes.String,
    default: 'Men haqimda',
  })
  aboutSectionTitle: string;

  @Prop({
    type: SchemaTypes.String,
    default:
      'Project Management sohasida o‘zimni rivojlantirib, IT loyihalar ustida ishlayapman. Bu sayt — orttirgan bilim va tajribalarimni boshqalar bilan bo‘lishish, real case va amaliy tajribalar orqali o‘rganish maydoni.',
  })
  aboutSectionParagraphOne: string;

  @Prop({
    type: SchemaTypes.String,
    default:
      'Asosan Linear’dan foydalanaman. Shuningdek Jira va ClickUp’da ishlash tajribam bor. Dokumentatsiya uchun Notion, jamoaviy hamkorlikda esa Github.',
  })
  aboutSectionParagraphTwo: string;

  @Prop({
    type: SchemaTypes.String,
    default: 'Tez-tez beriladigan savollar',
  })
  faqSectionTitle: string;

  @Prop({
    type: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
      },
    ],
    default: [
      {
        id: '1',
        title: 'IT loyiha boshqaruvi (PM) nima?',
        content:
          'IT loyiha boshqaruvi bu loyiha rejaga muvofiq, vaqtida va sifatli tugallanishini ta’minlaydigan jarayondir. Project Manager yoki qisqa qilib PM loyiha boshlig‘i hisoblanadi. U jamoani boshqaradi, mijoz bilan muloqot qiladi, vazifalarni taqsimlaydi va hammasi reja asosida ketishini nazorat qiladi.',
      },
      {
        id: '2',
        title: 'Agile va Waterfall o‘rtasidagi farq qanday?',
        content:
          'Waterfall usulida ishlar qat’iy ketma-ketlikda bajariladi. Avval reja tuziladi, keyin dizayn qilinadi, keyin dasturlash va test qilinadi. Orqaga qaytish qiyin. Agile usulida esa loyiha kichik qismlarga bo‘linib bajariladi. Har safar tayyor qilingan bo‘lak mijozga ko‘rsatiladi va kerak bo‘lsa o‘zgarish kiritiladi.',
      },
      {
        id: '3',
        title: 'IT loyihasini qanday boshlash kerak?',
        content:
          'Avvalo loyiha maqsadini aniq belgilash kerak. Keyin kimlar uchun mo‘ljallanganini aniqlash lozim. Shundan so‘ng kerakli funksiyalar ro‘yxati tuziladi. Texnologiya va jamoa tanlanadi.',
      },
      {
        id: '4',
        title: 'Jamoa bilan samarali ishlash uchun nima qilish kerak?',
        content:
          'Jamoada vazifalar aniq taqsimlanishi kerak. Doimiy aloqa qilish juda muhim. Har bir a’zo nima qilayotganini boshqalar ko‘rib turishi kerak. Shu bilan birga ochiq gaplashish va bir-biriga yordam berish muhitini yaratish jamoani samarali qiladi.',
      },
      {
        id: '5',
        title: 'IT loyihalarida xavflarni qanday boshqariladi?',
        content:
          "Xavf bu loyiha davomida paydo bo‘lishi mumkin bo‘lgan muammo. Masalan, deadline'ga ulgurmaslik, jamoa a’zosining ketib qolishi yoki byujet yetarli bo‘lmasligi. Bunday vaziyatlarni boshqarish uchun ularni oldindan yozib chiqish, har biri uchun yechim rejasini tayyorlash va favqulodda holatlar uchun qo‘shimcha vaqt hamda byujet qoldirish kerak bo‘ladi.",
      },
      {
        id: '6',
        title: 'IT loyihasi uchun qanday qilib buyurtma beraman?',
        content:
          'Avval o‘z g‘oyangizni aniq yozib chiqing. Unda qanday funksiyalar bo‘lishini ham ro‘yxat qiling. Byujet va muddatni taxminan belgilang. Keyin IT biz bilan bog‘lanib, shu talablaringizni tushuntiring. Shartnoma tuzib, bosqichma-bosqich ishlashni boshlash kerak bo‘ladi.',
      },
    ],
  })
  faqItems: FaqItem[];
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
