import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monster } from './monster.schema';
import { HttpService } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MonstersService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Monster.name) private monsterModel: Model<Monster>,
  ) {}

  async findAll(): Promise<Monster[]> {
    return this.monsterModel.find().exec();
  }

  async findOne(id: string): Promise<Monster> {
    return this.monsterModel.findById(id).exec();
  }

  async create(createMonsterDto: Monster): Promise<Monster> {
    // Realizar la llamada HTTP para obtener la información del tipo de monstruo

    let incubationTime = 0;

    try {
      const response$ = await this.httpService.get(
        `http://127.0.0.1:8000/api/monster-types/${createMonsterDto.typeCode}`,
      );

      const response = await lastValueFrom(response$);

      console.log('response: ' + JSON.stringify(response.data));

      incubationTime = response.data.incubation_time;
    } catch (error) {
      console.log('error:' + error);
    }

    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + incubationTime);

    // Sumar el tiempo de incubación a la hora actual
    createMonsterDto.incubationTime = currentTime.getTime();
    createMonsterDto.status = 'INCUBATING';
    createMonsterDto.code = uuidv4();

    const createdMonster = new this.monsterModel(createMonsterDto);
    return createdMonster.save();
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
