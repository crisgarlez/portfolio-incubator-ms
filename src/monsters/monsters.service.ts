import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monster } from './monster.schema';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class MonstersService {
  private readonly logger = new Logger(MonstersService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Monster.name) private monsterModel: Model<Monster>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<Monster[]> {
    return this.monsterModel.find().exec();
  }

  async findOne(id: string): Promise<Monster> {
    return this.monsterModel.findById(id).exec();
  }

  async create(createMonsterDto: Monster): Promise<Monster> {
    this.logger.debug('create...');

    const monsterTypesEndpoint = this.configService.get<string>(
      'MONSTER_TYPES_ENDPOINT',
    );

    let incubationTime = 0;

    try {
      const response$ = await this.httpService.get(
        `${monsterTypesEndpoint}/${createMonsterDto.typeCode}`,
      );

      const response = await lastValueFrom(response$);

      this.logger.debug('response: ' + JSON.stringify(response.data));

      incubationTime = response.data.incubation_time;
    } catch (error) {
      this.logger.debug('error:' + error);
      throw new RpcException('Monster Type not found');
    }

    this.logger.debug('incubationTime: ' + incubationTime);

    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + incubationTime);

    createMonsterDto.incubationTime = currentTime.getTime();
    createMonsterDto.status = 'INCUBATING';
    createMonsterDto.imageUrl = `https://robohash.org/${createMonsterDto.name.replace(
      /\s/g,
      '',
    )}${createMonsterDto.attack}${createMonsterDto.defense}${
      createMonsterDto.hp
    }${createMonsterDto.speed}?set=set2`;
    createMonsterDto.code = uuidv4();

    return this.monsterModel.create(createMonsterDto);
  }

  async update(id: string, updateMonsterDto: Monster): Promise<Monster> {
    return this.monsterModel
      .findByIdAndUpdate(id, updateMonsterDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Monster> {
    return this.monsterModel.findByIdAndRemove(id).exec();
  }
}
