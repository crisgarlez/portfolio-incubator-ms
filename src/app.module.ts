import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonstersModule } from './monsters/monsters.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [ConfigurationModule, DatabaseModule, MonstersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
