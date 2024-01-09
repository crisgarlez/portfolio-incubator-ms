import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

import { MonstersService } from './monsters.service';

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @EventPattern('create-monster-topic')
  async createMonsterTopic(@Payload() data: any, @Ctx() context: KafkaContext) {
    console.log(`Topic: ${context.getTopic()}`);
    console.log('#createMonsterTopic#');
    console.log('data: ' + JSON.stringify(data));

    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    // await this.client.commitOffsets([{ topic, partition, offset }]);
    return await this.monstersService.create(data);
  }
}
