import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Length } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'Cool Movies App',
    description: 'Project title',
    required: true
  })
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    example: 'Best movie trailers',
    description: 'Short project subtitle',
    required: true
  })
  @IsString()
  @Length(3, 150)
  subtitle: string;

  @ApiProperty({
    example:
      'This project allows users to browse and watch trailers of the latest movies.',
    description: 'Detailed description of the project',
    required: true
  })
  @IsString()
  @Length(10, 1000)
  description: string;

  @ApiProperty({
    example: 'https://coolmoviesapp.com',
    description: 'Project website or app URL',
    required: true,
  })
  @IsUrl()
  url: string;
}
