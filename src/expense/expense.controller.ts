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
    NotFoundException,
  } from '@nestjs/common';
  import { ExpenseService } from './expense.service';
  
  @Controller('expense')
  export class ExpenseController {
    constructor(private readonly expenseService: ExpenseService) {}
  
    @Post()
    @HttpCode(201)
    createExpense(
      @Body() expense: { name: string; amount: number; date: string },
    ) {
      return this.expenseService.createExpense(expense);
    }
  
    @Get()
    findAllExpenses() {
      return this.expenseService.findAllExpenses();
    }
  
    @Get(':id')
    findOneExpense(@Param('id', ParseIntPipe) id: number) {
      const expense = this.expenseService.findOneExpense(id);
      if (!expense) {
        throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
      }
      return expense;
    }
  
    @Put(':id')
    updateExpense(
      @Param('id', ParseIntPipe) id: number,
      @Body() updatedExpense: { name?: string; amount?: number; date?: string },
    ) {
      const updated = this.expenseService.updateExpense(id, updatedExpense);
      if (!updated) {
        throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
      }
      return updated;
    }
  
    @Delete(':id')
    @HttpCode(204)
    deleteExpense(@Param('id', ParseIntPipe) id: number) {
      const deleted = this.expenseService.deleteExpense(id);
      if (!deleted) {
        throw new NotFoundException(`Despesa com ID ${id} não encontrada`);
      }
      return deleted;
    }
  }
  