import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUrl, IsOptional } from 'class-validator';

export class CreateMonsterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  attack: number;

  @IsNotEmpty()
  @IsNumber()
  defense: number;

  @IsNotEmpty()
  @IsNumber()
  hp: number;

  @IsNotEmpty()
  @IsNumber()
  speed: number;

  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  typeCode: string;
}

export class UpdatePartialMonsterDto extends PartialType(CreateMonsterDto) {}

export class ExcludeCodeDto extends OmitType(CreateMonsterDto, [
  'code',
] as const) {
  @Exclude()
  code?: string;
}

export class UpdateMonsterDto extends IntersectionType(
  UpdatePartialMonsterDto,
  ExcludeCodeDto,
) {}

export class FindByCodeDto extends PickType(CreateMonsterDto, [
  'code',
] as const) {
  @IsNotEmpty()
  code: string;
}
