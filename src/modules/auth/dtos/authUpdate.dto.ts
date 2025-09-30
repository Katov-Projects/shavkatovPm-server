import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class AuthUpdateDto {
  @ApiProperty({ type: 'string', example: 'salom12', required: true })
  @IsString()
  login: string;

  @ApiProperty({ type: 'string', example: 'salom12', required: true })
  @IsString()
  password: string;
}