import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Public } from '../utils/decorators/isPublic.decorator';
import { Roles } from '../utils/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { ChestsService } from './chests.service';
import { CreateChestDto } from './dto/create-chest.dto';
import { UpdateChestDto } from './dto/update-chest.dto';

@Controller('chests')
export class ChestsController {
  constructor(private readonly chestsService: ChestsService) {}

  @Roles(Role.User)
  @Post()
  create() {
    return this.chestsService.create();
  }

  @Roles(Role.User)
  @Get(':code')
  decypher(@Param() params) {
    return this.chestsService.decypher(params.code);
  }
}
