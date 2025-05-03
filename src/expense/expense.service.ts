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
    ];

    createExpense(expense: { name: string; amount: number; date: string }) {
        const newExpense = { id: this.expenses.length + 1, ...expense };
        this.expenses.push(newExpense);
        return newExpense;
    }

    findAllExpenses() {
        return this.expenses;
    }

    findOneExpense(id: number) {
        console.log('Buscando despesa com ID:', id);
        const expense = this.expenses.find(exp => exp.id === Number(id));
        console.log('Resultado:', expense);
        return expense || null;
    }

    updateExpense(id: number, updatedExpense: { name?: string; amount?: number; date?: string }) {
        const expenseIndex = this.expenses.findIndex(expense => expense.id === Number(id));
        if (expenseIndex > -1) {
            this.expenses[expenseIndex] = { ...this.expenses[expenseIndex], ...updatedExpense };
            return this.expenses[expenseIndex];
        }
        return null;
    }

    deleteExpense(id: number) {
        const expenseIndex = this.expenses.findIndex(expense => expense.id === Number(id));
        if (expenseIndex > -1) {
            const deletedExpense = this.expenses[expenseIndex];
            this.expenses.splice(expenseIndex, 1);
            return deletedExpense;
        }
        return null;
    }
}
