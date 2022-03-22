import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { SafeIntTransform } from '../transforms/safe-int.transform';

export class PaginationDTO implements Readonly<PaginationDTO> {
  @ApiProperty({ required: true, type: Number })
  @IsInt()
  @Min(0)
  @Transform((value) => SafeIntTransform(value))
  page: number;

  @ApiProperty({ required: true, type: Number })
  @IsInt()
  @Min(5)
  @Max(100)
  @Transform((value) => SafeIntTransform(value))
  limit: number;
}
