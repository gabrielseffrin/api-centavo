import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomException } from './exceptions/custom.exception';

@Controller('errors')
export class ErrorsController {
  @Get('not-found/:id')
  getNotFound(@Param('id') id: String) {
    if (id !== '1') {
      throw new NotFoundException('Recurso não encontrado');
    }
    return { id, message: 'Recurso encontrado com sucesso' };
  }

  @Get('bad-request')
  getBadRequest(@Query('value') value: string) {
    if (!value || isNaN(Number(value))) {
      throw new BadRequestException(
        'O parâmetro "value" é obrigatório e deve ser numérico',
      );
    }
    return { value: Number(value), message: 'Parâmetro válido' };
  }

  @Get('forbidden')
  getForbidden(@Query('admin') isAdmin: string) {
    if (isAdmin !== 'true') {
      throw new ForbiddenException(
        'Acesso negado: você não tem permissão para acessar este recurso',
      );
    }
    return { message: 'Acesso permitido para administradores' };
  }

  @Get('/http-exception-simple')
  throwHttpExceptionSimple() {
    throw new HttpException('Acesso proibido', HttpStatus.FORBIDDEN);
  }

  @Get('/custom-error')
  throwCustomError() {
    throw new CustomException();
  }
}
