import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class FaqItemDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(['newest', 'oldest', 'mostViewed'], {
    message: "blogSortBy 'newest', 'oldest', yoki 'mostViewed' bo'lishi kerak",
  })
  blogSortBy?: string;

  @IsOptional()
  heroTitle?: string;

  @IsOptional()
  heroSubtitleOne?: string;

  @IsOptional()
  heroSubtitleTwo?: string;

  @IsOptional()
  aboutSectionTitle?: string;

  @IsOptional()
  aboutSectionParagraphOne?: string;

  @IsOptional()
  aboutSectionParagraphTwo?: string;

  @IsOptional()
  faqSectionTitle?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FaqItemDto)
  faqItems?: FaqItemDto[];
}
