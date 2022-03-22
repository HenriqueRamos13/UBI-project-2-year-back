import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersModule } from './users/users.module';
import { RolesGuard } from './utils/guards/roles.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { NewThrottlerGuard } from './utils/guards/throttler.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgreConfig } from './utils/config/postgre.config';
import { BullModule } from '@nestjs/bull';
import { ChestsModule } from './chests/chests.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(postgreConfig.getTypeOrmConfig()),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_URI,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASS,
      },
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
    UsersModule,
    ChestsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: NewThrottlerGuard,
    },
  ],
})
export class AppModule {}
