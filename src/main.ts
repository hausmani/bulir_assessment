import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const configService = app.get<ConfigService>(ConfigService);
  
  const config = new DocumentBuilder()
    .setTitle('Mysql  Boilerplate')
    .setDescription('Mysql  Boilerplate API docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(configService.get('ports.main') || 3000);
}
bootstrap();
