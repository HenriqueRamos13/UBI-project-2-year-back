import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SafeIntTransform } from '../../utils/transforms/safe-int.transform';

export class AuthNewPassDTO implements Readonly<AuthNewPassDTO> {
  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsEmail()
  @MaxLength(170)
  email: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @MaxLength(170)
  @MinLength(8)
  password: string;
}

export class AuthVerifyCodeDTO implements Readonly<AuthVerifyCodeDTO> {
  @ApiProperty({ required: true, type: Number })
  @IsInt()
  @Transform((value) => SafeIntTransform(value))
  code: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsEmail()
  @MaxLength(170)
  email: string;
}

export class AuthAccountVerifyDTO implements Readonly<AuthAccountVerifyDTO> {
  @ApiProperty({ required: true, type: String })
  @IsUUID()
  id: string;
}
