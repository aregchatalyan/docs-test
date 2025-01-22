import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);

  const PORT = config.get<string>('PORT') || 3030;
  const CLIENT_URL = config.get<string>('CLIENT_URL');

  app.enableCors({
    credentials: true,
    origin: CLIENT_URL
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Test')
    .setDescription('Test app API')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT, () => {
    console.log('Server running on port:', PORT);
  });
})();
