import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import Helmet from 'helmet';
// import * as csurf from 'csurf';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './utils/pipes/validation.pipe';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor } from '@nestjs/common';
// import { verifyTimestamps } from './utils/functions/verify-timestamps';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  console.log('You are in ', process.env.NODE_ENV);
  const corsOptions = {
    origin:
      process.env.LOADERIO_ACTIVE === 'true' ? '*' : [process.env.PLATFORM_URL],
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Origin, Timestamp',
    preflightContinue: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  app.enableCors(corsOptions);
  app.use(Helmet());
  app.use(cookieParser());
  app.set('trust proxy', 1);
  // app.use((req, res, next) => verifyTimestamps(req, res, next));
  // app.use(
  //   csurf({
  //     sameSite: 'lax',
  //   }),
  // );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Dungeon Explorer Swagger')
      .setDescription('The Dungeon Explorer API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3333);
}
bootstrap();
