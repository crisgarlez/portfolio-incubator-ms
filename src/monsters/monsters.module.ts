import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Monster, MonsterSchema } from './monster.schema';
import { HttpModule } from '@nestjs/axios';
import { MonstersController } from './monsters.controller';
import { MonstersService } from './monsters.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: Monster.name,
        schema: MonsterSchema,
      },
    ]),
  ],
  controllers: [MonstersController],
  providers: [MonstersService],
})
export class MonstersModule {}
