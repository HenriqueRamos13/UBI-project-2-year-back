import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

class PostgreConfig {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);
    return mode !== 'development';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: this.getValue('TYPEORM_CONNECTION') as 'postgres',

      host: this.getValue('TYPEORM_HOST'),
      port: parseInt(this.getValue('TYPEORM_PORT')),
      username: this.getValue('TYPEORM_USERNAME'),
      password: this.getValue('TYPEORM_PASSWORD'),
      database: this.getValue('TYPEORM_DATABASE'),

      entities: [this.getValue('TYPEORM_ENTITIES')],

      migrationsTableName: this.getValue('TYPEORM_MIGRATIONS_TABLE_NAME'),

      migrations: [this.getValue('TYPEORM_MIGRATIONS')],

      cli: {
        migrationsDir: this.getValue('TYPEORM_MIGRATIONS_DIR'),
      },

      logging: this.getValue('TYPEORM_LOGGING') === 'true',

      synchronize: this.getValue('TYPEORM_SYNCHRONIZE') === 'true',

      autoLoadEntities: true,

      // ssl: this.isProduction(),
    };
  }
}

const postgreConfig = new PostgreConfig(process.env).ensureValues([
  'RUN_MIGRATIONS',
  'TYPEORM_CONNECTION',
  'TYPEORM_HOST',
  'TYPEORM_USERNAME',
  'TYPEORM_PASSWORD',
  'TYPEORM_DATABASE',
  'TYPEORM_PORT',
  'TYPEORM_SYNCHRONIZE',
  'TYPEORM_LOGGING',
  'TYPEORM_ENTITIES',
  'TYPEORM_MIGRATIONS',
  'TYPEORM_MIGRATIONS_DIR',
  'TYPEORM_MIGRATIONS_TABLE_NAME',
]);

export { postgreConfig };
