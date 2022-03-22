import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Role } from '../../utils/enums/role.enum';
import { BaseEntity } from './Base.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { Exclude } from 'class-transformer';

// deepcode ignore HardcodedSecret: <please specify a reason of ignoring this>
const HASH_POWER = 14;

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 170, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 80 })
  password: string;

  // @OneToOne(() => StudentData, { cascade: true })
  // @JoinColumn()
  // student_data: StudentData;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  roles: Role[];

  // @OneToMany(() => Payment, (payment) => payment.user)
  // payments: Payment[];

  // @ManyToMany(() => Video, (video) => video.users, { cascade: true })
  // @JoinTable()
  // videos_watched: Video[];

  public async compareHash(hash: string): Promise<boolean> {
    return bcrypt.compareSync(hash, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, HASH_POWER);
      } catch (e) {
        throw new BadRequestException({
          error: 'Error: PI',
        });
      }
    }
  }
}
