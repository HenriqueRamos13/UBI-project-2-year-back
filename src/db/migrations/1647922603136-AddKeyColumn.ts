import {MigrationInterface, QueryRunner} from "typeorm";

export class AddKeyColumn1647922603136 implements MigrationInterface {
    name = 'AddKeyColumn1647922603136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chest" ADD "key" integer array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chest" DROP COLUMN "key"`);
    }

}
