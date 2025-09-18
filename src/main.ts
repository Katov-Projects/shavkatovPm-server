import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser middleware
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map((cat) => cat.trim())
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    optionsSuccessStatus: 200,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  const config = new DocumentBuilder()
    .setTitle('Shavkatov Pm')
    .setDescription('Shavkatov Pm API')
    .setVersion('1.0')
    .build();

  // Swagger faqat developmentda ochiladi
  if (process.env.NODE_ENV?.trim() === 'development') {
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  const HOST = process.env.HOST ?? 'http://localhost:';
  const PORT = parseInt(process.env.APP_PORT ?? '5000', 10);
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`${HOST}${PORT}`);
  });
}
bootstrap();
