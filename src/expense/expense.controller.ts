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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('expense')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) 
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @ApiOperation({ summary: 'Criar uma nova despesa' })
  @ApiResponse({ status: 201, description: 'Despesa criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @Post()
  @HttpCode(201)
  async createExpense(@Body() createExpenseDto: CreateExpenseDto, @Req() req: Request) {
    const userId = (req.user as { id: number }).id; 
    return this.expenseService.createExpense(createExpenseDto, userId);
  }

  @ApiOperation({ summary: 'Listar todas as despesas' })
  @ApiResponse({ status: 200, description: 'Lista de despesas retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllExpenses(
    @Query() queryFilterDto: QueryFilterDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as { id: number }).id;
    return this.expenseService.findAllExpenses(
      userId,
      queryFilterDto.filter,
      queryFilterDto.page,
    );
  }

  @ApiOperation({ summary: 'Buscar uma despesa específica' })
  @ApiResponse({ status: 200, description: 'Despesa encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  @Get(':id')
  async findOneExpense(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const userId = (req.user as { id: number }).id;
    // 🔑 3. A verificação de "não encontrado" agora é feita no serviço
    return this.expenseService.findOneExpense(id, userId);
  }

  @ApiOperation({ summary: 'Atualizar uma despesa específica' })
  @ApiResponse({ status: 200, description: 'Despesa atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  @Put(':id')
  async updateExpense(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto, // Usando um DTO para consistência
    @Req() req: Request,
  ) {
    const userId = (req.user as { id: number }).id;
    // A verificação de "não encontrado" também é feita no serviço
    return this.expenseService.updateExpense(id, updateExpenseDto, userId);
  }

  @ApiOperation({ summary: 'Excluir uma despesa específica' })
  @ApiResponse({ status: 204, description: 'Despesa excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Despesa não encontrada.' })
  @Delete(':id')
  @HttpCode(204)
  async deleteExpense(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const userId = (req.user as { id: number }).id;
    await this.expenseService.deleteExpense(id, userId);
    }
}