import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import 'dotenv/config';
import { Repository } from 'typeorm';
import { Chest } from '../../../db/models/Chests.entity';
import { ChestStatus } from '../../enums/chest-status.enum';
import * as crypto from 'crypto';

const DIFFICULTY = {
  legendary: {
    maxValues: [255, 255, 255, 1],
  },
  hard: {
    maxValues: [255, 255, 255, 0],
  },
  medium: {
    maxValues: [255, 255, 127, 0],
  },
  easy: {
    maxValues: [255, 255, 64, 0],
  },
};

@Processor('decrypt-queue')
export class DecryptConsumer {
  constructor(
    @InjectRepository(Chest) private readonly repository: Repository<Chest>,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(
      `Job ${job.id} of type ${job.name} with data ${job.data} completed!`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(
      `Job ${job.id} of type ${job.name} with data ${job.data} failed!`,
    );
    console.log(err);
  }

  @Process('decrypt-job')
  async decryptJob(job: Job) {
    const code = job.data;
    await job.progress(50);

    const chest = await this.repository.findOne({
      where: {
        code: code,
      },
    });

    await this.repository.save({
      ...chest,
      status: ChestStatus.Oppening,
    });

    let startTime, endTime;
    function start() {
      startTime = new Date();
    }
    function end() {
      endTime = new Date();
      let timeDiff = endTime - startTime;
      timeDiff /= 1000;
      const seconds = Math.round(timeDiff);
      return seconds;
    }

    const iv = Buffer.from([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    start();

    const original = chest.key;

    const range = ({
      from = 0,
      to,
      step = 1,
      length = Math.ceil((to - from) / step),
    }): number[] => Array.from({ length }, (_, i) => from + i * step);

    const first = range({
      from: 0,
      to: DIFFICULTY[chest.difficulty].maxValues[0],
      step: 1,
    });

    const second = range({
      from: 0,
      to: DIFFICULTY[chest.difficulty].maxValues[1],
      step: 1,
    });

    const third = range({
      from: 0,
      to: DIFFICULTY[chest.difficulty].maxValues[2],
      step: 1,
    });

    let four = range({
      from: 0,
      to: DIFFICULTY[chest.difficulty].maxValues[3],
      step: 1,
    });

    four = [0];

    // first.forEach(async (i) => {
    //   second.forEach(async (j) => {
    //     third.forEach(async (k) => {
    //       four.forEach(async (l) => {
    //         console.log(i, j, k, l);
    //         if (
    //           i === original[0] &&
    //           j === original[1] &&
    //           k === original[2] &&
    //           l === original[3]
    //         ) {
    //           console.log(i, j, k, l, end());
    //           const decipher = await crypto.createDecipheriv(
    //             'aes-128-cbc',
    //             Buffer.from([i, j, k, l, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    //             iv,
    //           );
    //           let decrypted = await decipher.update(code, 'hex', 'utf8');

    //           decrypted += decipher.final('utf8');
    //           if (decrypted.includes('Hello')) {
    //             await this.repository.save({
    //               ...chest,
    //               status: ChestStatus.Openned,
    //             });
    //             await job.progress(100);

    //             // return {
    //             //   seconds: end(),
    //             //   decrypted,
    //             // };
    //           } else {
    //           }
    //         }
    //       });
    //     });
    //   });
    // });

    for (let i = 0; i < DIFFICULTY[chest.difficulty].maxValues[0] + 1; i++) {
      for (let j = 0; j < DIFFICULTY[chest.difficulty].maxValues[1] + 1; j++) {
        for (
          let k = 0;
          k < DIFFICULTY[chest.difficulty].maxValues[2] + 1;
          k++
        ) {
          for (
            let l = 0;
            l < DIFFICULTY[chest.difficulty].maxValues[3] + 1;
            l++
          ) {
            if (
              i === original[0] &&
              j === original[1] &&
              k === original[2] &&
              l === original[3]
            ) {
              console.log(i, j, k, l, end());
              const decipher = await crypto.createDecipheriv(
                'aes-128-cbc',
                Buffer.from([i, j, k, l, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                iv,
              );
              let decrypted = await decipher.update(code, 'hex', 'utf8');

              decrypted += decipher.final('utf8');
              if (decrypted.includes('Hello')) {
                await this.repository.save({
                  ...chest,
                  status: ChestStatus.Openned,
                });
                await job.progress(100);

                // return {
                //   seconds: end(),
                //   decrypted,
                // };
              } else {
              }
            }
          }
        }
      }
    }

    await this.repository.save({
      ...chest,
      status: ChestStatus.Locked,
    });
    await job.progress(100);

    // return {
    //   seconds: end(),
    //   decrypted: false,
    // };
  }
}
