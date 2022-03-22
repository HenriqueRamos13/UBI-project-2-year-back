import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Difficulty } from '../utils/enums/difficulty.enum';
import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chest } from '../db/models/Chests.entity';
import { ChestStatus } from '../utils/enums/chest-status.enum';
import { DecryptProducerService } from '../utils/jobs/decrypt/decrypt-producer.service';

const DIFFICULTY = {
  legendary: {
    maxValues: [255, 255, 255, 255, 15],
  },
  hard: {
    maxValues: [255, 255, 255, 255, 15],
  },
  medium: {
    maxValues: [255, 255, 255, 255, 15],
  },
  easy: {
    maxValues: [255, 255, 255, 255, 15],
  },
};

const dificulty = Difficulty.Legendary;

@Injectable()
export class ChestsService {
  constructor(
    @InjectRepository(Chest) private readonly repository: Repository<Chest>,
    private connection: Connection,
    private decypherService: DecryptProducerService,
  ) {}

  async create() {
    const chests = {
      easy: null,
      medium: null,
      hard: null,
      legendary: null,
    };

    Object.keys(chests).forEach((dif) => {
      const keyGenerated = [
        // Math.round(Math.random() * DIFFICULTY[dif].maxValues[0]),
        // Math.round(Math.random() * DIFFICULTY[dif].maxValues[1]),
        // Math.round(Math.random() * DIFFICULTY[dif].maxValues[2]),
        // Math.round(Math.random() * DIFFICULTY[dif].maxValues[3]),
        255, 255, 255, 255, 15,
      ];

      const key = Buffer.from([
        keyGenerated[0],
        keyGenerated[1],
        keyGenerated[2],
        keyGenerated[3],
        keyGenerated[4],
        // /**/ 0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]);
      const iv = Buffer.from([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

      const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
      const encrypted = cipher.update('Hello' as any);

      chests[dif] = {
        code: Buffer.concat([encrypted as any, cipher.final()]).toString('hex'),
        dificulty: dif,
        key: keyGenerated,
        status: ChestStatus.Locked,
      };
    });

    const queryRunner = this.connection.createQueryRunner();
    try {
      await queryRunner.startTransaction();

      await queryRunner.manager.save(Chest, {
        code: chests.easy.code,
        difficulty: chests.easy.dificulty,
        key: chests.easy.key,
      });

      await queryRunner.manager.save(Chest, {
        code: chests.medium.code,
        difficulty: chests.medium.dificulty,
        key: chests.medium.key,
      });

      await queryRunner.manager.save(Chest, {
        code: chests.hard.code,
        difficulty: chests.hard.dificulty,
        key: chests.hard.key,
      });

      await queryRunner.manager.save(Chest, {
        code: chests.legendary.code,
        difficulty: chests.legendary.dificulty,
        key: chests.legendary.key,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return {
        chests: [chests.easy, chests.medium, chests.hard, chests.legendary],
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException({
        error: 'Erro na transação',
      });
    }
  }

  async decypher(cypher: string) {
    const chest = await this.repository.findOne({
      where: {
        code: cypher,
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
      let timeDiff = endTime - startTime; //in ms
      timeDiff /= 1000;
      const seconds = Math.round(timeDiff);
      return seconds;
    }

    const iv = Buffer.from([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    start();

    const original = chest.key;

    for (let i = 0; i < DIFFICULTY[dificulty].maxValues[0] + 1; i++) {
      for (let j = 0; j < DIFFICULTY[dificulty].maxValues[1] + 1; j++) {
        for (let k = 0; k < DIFFICULTY[dificulty].maxValues[2] + 1; k++) {
          for (let l = 0; l < DIFFICULTY[dificulty].maxValues[3] + 1; l++) {
            for (let p = 0; p < DIFFICULTY[dificulty].maxValues[4] + 1; p++) {
              // console.log(i, j, k, l);

              if (
                i === original[0] &&
                j === original[1] &&
                k === original[2] &&
                l === original[3] &&
                p === original[4]
              ) {
                const decipher = crypto.createDecipheriv(
                  'aes-128-cbc',
                  Buffer.from([i, j, k, l, p, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                  iv,
                );

                let decrypted = decipher.update(cypher, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                if (decrypted.includes('Hello')) {
                  await this.repository.save({
                    ...chest,
                    status: ChestStatus.Openned,
                  });
                  return {
                    seconds: end(),
                    decrypted,
                  };
                } else {
                }
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

    return {
      seconds: end(),
      decrypted: false,
    };

    // this.decypherService.decrypt(cypher);
    // return true;
  }
}

// const original = [255, 255, 255, 2]; 324 seconds
// const original = [255, 255, 255, 1]; 233 seconds
// const original = [255, 255, 255, 0]; 122 seconds
// const original = [255, 255, 254, 0]; 97 seconds
// const original = [255, 255, 127, 0]; 52 seconds
// const original = [255, 255, 64, 0]; 29 seconds

// const key = Buffer.from([
//   0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01,
//   0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, /* */ 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
// ]);
// const iv = Buffer.from([
//   0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01,
//   0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, 0b01, /* */ 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
//   0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00, 0b00,
// ]);
// Math.round(Math.random() * 255)
