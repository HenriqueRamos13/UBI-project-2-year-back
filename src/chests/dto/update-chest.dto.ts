import { PartialType } from '@nestjs/swagger';
import { CreateChestDto } from './create-chest.dto';

export class UpdateChestDto extends PartialType(CreateChestDto) {}
