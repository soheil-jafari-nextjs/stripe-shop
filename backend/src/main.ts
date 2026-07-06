import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
   const app = await NestFactory.create<NestExpressApplication>(AppModule);

   app.useGlobalPipes(
      new ValidationPipe({
         whitelist: true,
         transform: true,
         transformOptions: {
            enableImplicitConversion: true,
         },
      }),
   );
   app.getHttpAdapter().getInstance().set('trust proxy', true);
   app.use(cookieParser());
   await app.listen(3001);
}
bootstrap();
