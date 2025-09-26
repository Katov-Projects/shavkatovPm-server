import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class HeaderDto {
  @ApiProperty({ example: 'SDCLKSDMCKA', description: 'Blog sarlavhasi' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'nima gablar',
    description: 'Blog kichik sarlavhasi',
  })
  @IsString()
  @IsNotEmpty()
  subtitle: string;
}

class SectionDto {
  @ApiProperty({ example: 'Section title', description: 'Bo‘lim sarlavhasi' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Section subtitle', description: 'Bo‘lim izohi' })
  @IsString()
  @IsNotEmpty()
  subtitle: string;
}

class ValueObjectDto {
  @ApiProperty({ example: 'SEO value', description: 'SEO yoki teg qiymati' })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateBlogDto {
  @ApiProperty({ type: HeaderDto })
  @ValidateNested()
  @Type(() => HeaderDto)
  header: HeaderDto;

  @ApiProperty({ type: [SectionDto], description: 'Blog bo‘limlari' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];

  @ApiProperty({ type: [ValueObjectDto], description: "SEO ma'lumotlari" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueObjectDto)
  seo: ValueObjectDto[];

  @ApiProperty({ type: [ValueObjectDto], description: 'Blog teglar ro‘yxati' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueObjectDto)
  tags: ValueObjectDto[];
  
  @IsString()
  categoryId: string;
}
