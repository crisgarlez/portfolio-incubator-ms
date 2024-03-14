import {
  ClassSerializerInterceptor,
  Controller,
  Logger,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, Payload, RpcException } from '@nestjs/microservices';

import { MonstersService } from './monsters.service';
import { CustomRpcExceptionFilter } from 'src/common/filters/custom-rpc-exception.filter';
import { Monster } from './monster.schema';

@Controller('monsters')
export class MonstersController {
  private readonly logger = new Logger(MonstersController.name);

  constructor(private readonly monstersService: MonstersService) {}

  @EventPattern('create-monster-topic')
  @UseFilters(new CustomRpcExceptionFilter())
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new RpcException(errors);
      },
    }),
  )
  @UseInterceptors(ClassSerializerInterceptor)
  async createMonsterTopic(@Payload() data: any) {
    this.logger.debug('createMonsterTopic...');

    const monster = await this.monstersService.create(data);

    return new Monster({
      _id: monster?._id,
      attack: monster?.attack,
      code: monster?.code,
      defense: monster?.defense,
      hp: monster?.hp,
      imageUrl: monster?.imageUrl,
      name: monster?.name,
      speed: monster?.speed,
      typeCode: monster?.typeCode,
    });
  }
}
