import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1647919948224 implements MigrationInterface {
    name = 'FirstMigration1647919948224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."chest_status_enum" AS ENUM('locked', 'oppening', 'fail', 'oppened')`);
        await queryRunner.query(`CREATE TYPE "public"."chest_difficulty_enum" AS ENUM('easy', 'medium', 'hard', 'legendary')`);
        await queryRunner.query(`CREATE TABLE "chest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL DEFAULT '1', "code" character varying(257) NOT NULL, "status" "public"."chest_status_enum" NOT NULL DEFAULT 'locked', "difficulty" "public"."chest_difficulty_enum" NOT NULL DEFAULT 'easy', CONSTRAINT "PK_cd739023b469091865c934ded4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_roles_enum" AS ENUM('user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted" boolean NOT NULL DEFAULT false, "version" integer NOT NULL DEFAULT '1', "email" character varying(170) NOT NULL, "password" character varying(80) NOT NULL, "roles" "public"."user_roles_enum" array NOT NULL DEFAULT '{user}', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
        await queryRunner.query(`DROP TABLE "chest"`);
        await queryRunner.query(`DROP TYPE "public"."chest_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."chest_status_enum"`);
    }

}
