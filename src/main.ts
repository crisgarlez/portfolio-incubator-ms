import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('PORT');
  const KAFKA_BROKER = configService.get<string>('KAFKA_BROKER');
  const KAFKA_CLIENT_ID = configService.get<string>('KAFKA_CLIENT_ID');
  const KAFKA_CONSUMER_ID = configService.get<string>('KAFKA_CONSUMER_ID');

  logger.debug('PORT:', PORT);
  logger.debug('KAFKA_BROKER:', KAFKA_BROKER);
  logger.debug('KAFKA_CLIENT_ID:', KAFKA_CLIENT_ID);
  logger.debug('KAFKA_CONSUMER_ID:', KAFKA_CONSUMER_ID);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.setViewEngine('hbs');

  app.connectMicroservice({
    name: 'INCUBATOR_MS',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: KAFKA_CLIENT_ID,
        brokers: [KAFKA_BROKER],
      },
      consumer: {
        groupId: KAFKA_CONSUMER_ID,
      },
    },
  });
  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}
bootstrap();
