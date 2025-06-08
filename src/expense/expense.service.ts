import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto/expense.dto'; // Supondo que você moveu os DTOs

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  // 🔑 Agora precisa do ID do usuário que está criando a despesa
  async createExpense(data: CreateExpenseDto, userId: number) {
    return this.prisma.expense.create({
      data: {
        name: data.name,
        amount: data.amount,
        date: new Date(data.date),
        // Conecta a despesa ao usuário correto
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  // 🔑 Busca apenas as despesas do usuário especificado
  async findAllExpenses(userId: number, filter?: string, page = 1, returnAll = false) {
    const where: Prisma.ExpenseWhereInput = {
      // A condição MAIS IMPORTANTE: garantir que a despesa pertence ao usuário
      userId: userId, 
    };

    if (filter) {
      where.name = {
        contains: filter,
        mode: 'insensitive',
      };
    }
    
    // O resto da lógica de paginação permanece igual...
    if (returnAll) {
      const results = await this.prisma.expense.findMany({ where });
      return { page: 1, total: results.length, data: results };
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const [total, data] = await Promise.all([
      this.prisma.expense.count({ where }),
      this.prisma.expense.findMany({ where, skip, take: pageSize, orderBy: { date: 'desc' } }),
    ]);
    
    return { page, total, data };
  }
  
  // 🔑 Busca uma despesa específica, mas verifica se ela pertence ao usuário
  async findOneExpense(id: number, userId: number) {
    // Usamos findFirst para combinar a busca por ID e userId
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: id,
        userId: userId, // Garante que o usuário só pode buscar sua própria despesa
      },
    });

    if (!expense) {
      throw new NotFoundException(`Despesa com ID ${id} não encontrada ou não pertence a você.`);
    }
    return expense;
  }

  // 🔑 Atualiza uma despesa APÓS verificar se o usuário é o dono
  async updateExpense(id: number, data: UpdateExpenseDto, userId: number) {
    // Primeiro, garante que a despesa existe e pertence ao usuário
    await this.findOneExpense(id, userId);

    return this.prisma.expense.update({
      where: { id }, // Podemos usar o ID aqui porque já validamos a posse
      data: {
        ...data,
        ...(data.date && { date: new Date(data.date) }),
      },
    });
  }

  // 🔑 Deleta uma despesa APÓS verificar se o usuário é o dono
  async deleteExpense(id: number, userId: number) {
    // Mesmo padrão de verificação de posse
    await this.findOneExpense(id, userId);

    return this.prisma.expense.delete({
      where: { id },
    });
  }
}