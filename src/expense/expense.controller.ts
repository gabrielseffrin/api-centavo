import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Body,
  Param,
  ParseIntPipe,
  Query,
  // --- NOVOS IMPORTS ---
  UseGuards, // Para proteger as rotas
  Req,         // Para acessar o objeto de requisição
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, QueryFilterDto, UpdateExpenseDto } from './dto/expense.dto'; // Recomendado adicionar UpdateExpenseDto
import { AuthGuard } from '@nestjs/passport'; // Assumindo que você usa o guardião de JWT
import { Request } from 'express'; // Tipagem para o objeto de requisição

// 🔑 1. Protege todas as rotas do controller com o guardião de autenticação
@UseGuards(AuthGuard('jwt')) 
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // 🔑 2. Recebe a requisição para extrair o ID do usuário
  @Post()
  @HttpCode(201)
  async createExpense(@Body() createExpenseDto: CreateExpenseDto, @Req() req: Request) {
    // Extrai o userId do payload do JWT (populado pelo AuthGuard)
    const userId = req.user['id']; 
    return this.expenseService.createExpense(createExpenseDto, userId);
  }

  @Get()
  async findAllExpenses(
    @Query() queryFilterDto: QueryFilterDto,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    return this.expenseService.findAllExpenses(
      userId,
      queryFilterDto.filter,
      queryFilterDto.page,
    );
  }

  @Get(':id')
  async findOneExpense(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    // 🔑 3. A verificação de "não encontrado" agora é feita no serviço
    return this.expenseService.findOneExpense(id, userId);
  }

  @Put(':id')
  async updateExpense(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto, // Usando um DTO para consistência
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    // A verificação de "não encontrado" também é feita no serviço
    return this.expenseService.updateExpense(id, updateExpenseDto, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteExpense(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const userId = req.user['id'];
    // A verificação de "não encontrado" também é feita no serviço
    await this.expenseService.deleteExpense(id, userId);
    // Em uma resposta 204, geralmente não se retorna conteúdo.
  }
}