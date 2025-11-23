import { IsEnum, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(['newest', 'oldest', 'mostViewed'], {
    message: "blogSortBy 'newest', 'oldest', yoki 'mostViewed' bo'lishi kerak",
  })
  blogSortBy?: string;
}
