import { Module } from '@nestjs/common';
import { ChestsService } from './chests.service';
import { ChestsController } from './chests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '../utils/entities';
import { DecryptModule } from '../utils/jobs/decrypt/decrypt.module';

@Module({
  imports: [TypeOrmModule.forFeature(entities), DecryptModule],
  controllers: [ChestsController],
  providers: [ChestsService],
})
export class ChestsModule {}
