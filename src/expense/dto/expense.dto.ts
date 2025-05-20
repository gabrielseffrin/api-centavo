import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { parse } from 'path';

export class CreateExpenseDto {
  @IsString({message: 'O nome deve ser uma string'})
  @IsNotEmpty({message: 'O nome não pode ser vazio'})
  name: string;

  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({message: 'O valor não pode ser vazio'})
  amount: number;

  @IsString({message: 'A data deve ser uma string'})
  @IsNotEmpty({message: 'A data não pode ser vazia'})
  date: string;
}

export class findOneExpenseDto {
    @IsNumber({}, { message: 'O valor deve ser um número' })
    @IsNotEmpty({message: 'O ID não pode ser vazio'})
    id: string;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class DeleteExpenseDto {
  @IsNumber({}, { message: 'O valor deve ser um número' })
  @IsNotEmpty({message: 'O ID não pode ser vazio'})
  id: string;
}

export class QueryFilterDto {
  @IsOptional()
  @IsString({message: 'O filtro deve ser uma string'})
  @Transform(({ value }) => value?.trim())
  filter?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;
}
