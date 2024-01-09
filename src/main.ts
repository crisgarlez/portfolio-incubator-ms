import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    name: 'INCUBATOR_MS',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'portfolio-incubator-ms',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'portfolio-incubator-ms-consumer',
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(3004);
}
bootstrap();
