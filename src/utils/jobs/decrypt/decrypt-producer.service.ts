import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class DecryptProducerService {
  constructor(@InjectQueue('decrypt-queue') private queue: Queue) {}

  async decrypt(code: string) {
    await this.queue.add('decrypt-job', code, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
      lifo: true,
    });
  }
}
