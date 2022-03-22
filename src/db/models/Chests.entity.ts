import { Entity, Column } from 'typeorm';
import { ChestStatus } from '../../utils/enums/chest-status.enum';
import { Difficulty } from '../../utils/enums/difficulty.enum';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'chest' })
export class Chest extends BaseEntity {
  @Column({ type: 'varchar', length: 257, nullable: false })
  code: string;

  @Column({
    type: 'enum',
    enum: ChestStatus,
    default: ChestStatus.Locked,
  })
  status: ChestStatus;

  @Column({
    type: 'enum',
    enum: Difficulty,
    default: Difficulty.Easy,
  })
  difficulty: Difficulty;

  @Column('int', { array: true })
  key: number[];
}
