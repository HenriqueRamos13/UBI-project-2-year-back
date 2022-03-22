import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { DecryptConsumer } from './decrypt-consumer';
import { DecryptProducerService } from './decrypt-producer.service';
import 'dotenv/config';
import entities from '../../entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    BullModule.registerQueue({
      name: 'decrypt-queue',
    }),
  ],
  controllers: [],
  providers: [DecryptConsumer, DecryptProducerService],
  exports: [DecryptProducerService],
})
export class DecryptModule {}
