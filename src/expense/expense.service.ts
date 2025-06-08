import { Injectable } from '@nestjs/common';

@Injectable()
export class ExpenseService {
  private expenses = [
    { id: 1, name: 'Farmacia', amount: 50, date: '2023-10-01' },
    { id: 2, name: 'Supermercado', amount: 150, date: '2023-10-02' },
    { id: 3, name: 'Gasolina', amount: 80, date: '2023-10-03' },
    { id: 4, name: 'Restaurante', amount: 120, date: '2023-10-04' },
    { id: 5, name: 'Cine', amount: 30, date: '2023-10-05' },
    { id: 6, name: 'Ropa', amount: 200, date: '2023-10-06' },
    { id: 7, name: 'Zapatos', amount: 100, date: '2023-10-07' },
    { id: 8, name: 'Medicamentos', amount: 60, date: '2023-10-08' },
    { id: 9, name: 'Alimentos', amount: 90, date: '2023-10-09' },
    { id: 10, name: 'Transporte', amount: 40, date: '2023-10-10' },
    { id: 11, name: 'Entretenimento', amount: 70, date: '2023-10-11' },
    { id: 12, name: 'Educação', amount: 110, date: '2023-10-12' },
    { id: 13, name: 'Saúde', amount: 130, date: '2023-10-13' },
    { id: 14, name: 'Lazer', amount: 140, date: '2023-10-14' },
    { id: 15, name: 'Viagem', amount: 160, date: '2023-10-15' },
  ];

  createExpense(expense: { name: string; amount: number; date: string }) {
    const newExpense = { id: this.expenses.length + 1, ...expense };
    this.expenses.push(newExpense);
    return newExpense;
  }

findAllExpenses(filter?: string, page = 1, returnAll = false) {
  let results = this.expenses;

  if (filter) {
    results = results.filter((expense) =>
      expense.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  if (returnAll) {
    return {
      page: 1,
      total: results.length,
      data: results,
    };
  }

  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;

  return {
    page,
    total: results.length,
    data: results.slice(startIndex, startIndex + pageSize),
  };
}

  findOneExpense(id: number) {
    console.log('Buscando despesa com ID:', id);
    const expense = this.expenses.find((exp) => exp.id === Number(id));
    console.log('Resultado:', expense);
    return expense || null;
  }

  updateExpense(
    id: number,
    updatedExpense: { name?: string; amount?: number; date?: string },
  ) {
    const expenseIndex = this.expenses.findIndex(
      (expense) => expense.id === Number(id),
    );
    if (expenseIndex > -1) {
      this.expenses[expenseIndex] = {
        ...this.expenses[expenseIndex],
        ...updatedExpense,
      };
      return this.expenses[expenseIndex];
    }
    return null;
  }

  deleteExpense(id: number) {
    const expenseIndex = this.expenses.findIndex(
      (expense) => expense.id === Number(id),
    );
    if (expenseIndex > -1) {
      const deletedExpense = this.expenses[expenseIndex];
      this.expenses.splice(expenseIndex, 1);
      return deletedExpense;
    }
    return null;
  }
}
