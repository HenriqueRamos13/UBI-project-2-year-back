import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UsersLoginDTO implements Readonly<UsersLoginDTO> {
  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsEmail()
  @MaxLength(170)
  email: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @MaxLength(80)
  password: string;
}

export class UsersFindOneDTO implements Readonly<UsersFindOneDTO> {
  @ApiProperty({ required: true, type: String })
  @IsUUID()
  id: string;
}

export class UsersFindAllDTO implements Readonly<UsersFindAllDTO> {}

export class UpdateUserDTO implements Readonly<UpdateUserDTO> {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(170)
  email: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  password: string;
}

export class UpdateUserAllDTO implements Readonly<UpdateUserAllDTO> {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MaxLength(170)
  email?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  password?: string;
}

export class UsersOnlyIdDTO implements Readonly<UsersOnlyIdDTO> {
  @ApiProperty({ required: true, type: String })
  @IsUUID()
  id: string;
}

export class RegisterUserDTO implements Readonly<RegisterUserDTO> {
  @ApiProperty({ required: true })
  @IsString()
  @IsEmail()
  @MaxLength(170)
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @MaxLength(80)
  @MinLength(8)
  password: string;
}
