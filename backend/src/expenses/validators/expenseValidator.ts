import { Request, Response } from 'express';
import { ExpenseCategories } from '../../utils/constants';
import { NewExpense } from '../../utils/types';

export function validateExpenseData(req: Request, res: Response): NewExpense | undefined {
  const { description, amount, category, date } = req.body;

  if (amount === 0) {
    res.status(400).json({ error: 'Amount must not be zero' });
    return undefined;
  }

  if (!description || !amount || !category || !date) {
    res.status(400).json({ error: 'Description, amount, category, and date are required fields' });
    return undefined;
  }

  if (!Object.values(ExpenseCategories).includes(category)) {
    res.status(400).json({ error: 'Invalid category. Please provide one of the predefined categories' });
    return undefined;
  }

  return { description, amount, category, date };
}
