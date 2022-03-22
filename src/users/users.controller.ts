import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../utils/decorators/isPublic.decorator';
import { Roles } from '../utils/decorators/roles.decorator';
import { PaginationDTO } from '../utils/dto/pagination.dto';
import { Role } from '../utils/enums/role.enum';
import {
  UpdateUserAllDTO,
  UpdateUserDTO,
  UsersFindOneDTO,
} from './dto/Users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @Roles(Role.User)
  public async getAll(@Query() pagination: PaginationDTO) {
    return await this.service.getAll(pagination);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  @Roles(Role.User)
  public async getOne(@Param() params: UsersFindOneDTO) {
    return await this.service.getOne(params);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.User)
  @Patch()
  public async patch(@Body() body: UpdateUserDTO, @Req() req) {
    return await this.service.patch(body, req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Roles(Role.User)
  @Put()
  public async put(@Body() body: UpdateUserAllDTO, @Req() req) {
    return await this.service.put(body, req.user);
  }
}
