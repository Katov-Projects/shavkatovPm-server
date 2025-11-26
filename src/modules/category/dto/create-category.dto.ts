import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: 'string', example: 'category', required: true })
  @IsString()
  name: string;
}
