import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../db/models/User.entity';
import { Connection, Repository } from 'typeorm';
import {
  RegisterUserDTO,
  UpdateUserAllDTO,
  UpdateUserDTO,
  UsersFindOneDTO,
} from './dto/Users.dto';
import { PaginationDTO } from '../utils/dto/pagination.dto';
import { Role } from '../utils/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private connection: Connection,
  ) {}

  public async getAll(pagination: PaginationDTO): Promise<[User[], number]> {
    return await this.repository.findAndCount({
      take: pagination.limit,
      skip: pagination.page * pagination.limit,
      relations: [],
    });
  }

  public async getOne(params: UsersFindOneDTO): Promise<User | undefined> {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.findOne(
        User,
        {
          where: {
            id: params.id,
          },
        },
        // {
        //   relations: [],
        // },
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException({
        error: 'Erro na transação',
      });
    }
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.findOne(
        User,
        {
          where: {
            email: email,
          },
        },
        // {
        //   relations: [],
        // },
      );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException({
        error: 'Erro na transação',
      });
    }
  }

  public async register(body: RegisterUserDTO): Promise<User> {
    const queryRunner = this.connection.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const userObj = this.repository.create({
        ...body,
        roles: [Role.User],
      });

      const user = await queryRunner.manager.save(userObj);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException({
        error: 'Erro na transação',
      });
    }
    // this.sendGridProducer.sendMail(mail);
  }

  public async patch(body: UpdateUserDTO, userReq: User): Promise<User> {
    return null;
  }

  public async put(body: UpdateUserAllDTO, userId: string): Promise<User> {
    return null;
  }
}
