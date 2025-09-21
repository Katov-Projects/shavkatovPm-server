import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, } from "class-validator";

export class SendMessageDto {
  @ApiProperty({ type: 'string', example: 'Muhammad Yusuf', required: true })
  @IsString()
  firstName: string;
  @ApiProperty({ type: 'string', example: 'Nasrulloh', required: true })
  @IsString()
  lastName: string;
  @ApiProperty({ type: 'string', example: 'yuvsufn@gmail.com', required: true })
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty({ type: "string", example: "123456789", required: true })
  @IsString()
  phone: string;
  @ApiProperty({ type: 'string', example: 'salomlashish', required: true })
  @IsString()
  subject: string;
  @ApiProperty({ type: 'string', example: '@wwts', required: true })
  @IsString()
  telegram: string;
  @ApiProperty({ type: 'string', example: 'salom hammaga', required: true })
  @IsString()
  message: string;
};
