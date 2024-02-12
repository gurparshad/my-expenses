import express from 'express';
import { createExpense, deleteExpense, getExpense, getExpenses, updateExpense } from '../controllers';

const expensesRouter = express.Router();

expensesRouter.get('/', getExpenses);

expensesRouter.get('/:expenseId', getExpense);

expensesRouter.post('/', createExpense);

expensesRouter.put('/:id', updateExpense);

expensesRouter.delete('/:id', deleteExpense);

export default expensesRouter;
