import { readDataFromFile } from '../services/readDataFromFile';
import { Request, Response } from 'express';
import { writeDataToFile } from '../services/writeDataToFile';
import { validateExpenseData } from '../validators/expenseValidator';
import { Expense, NewExpense } from '../model';

export const getExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    let expenses: Expense[] = await readDataFromFile();
    const { startDate, endDate, category, page, pageSize } = req.query;
    if (startDate && endDate) {
      expenses = expenses.filter((expense: Expense) => {
        const expenseDate = new Date(expense.date);
        const startDateObj = new Date(startDate.toString());
        const endDateObj = new Date(endDate.toString());
        return expenseDate >= startDateObj && expenseDate <= endDateObj;
      });
    }

    if (category) {
      expenses = expenses.filter((expense: Expense) => expense.category === category);
    }

    if (page && pageSize) {
      const pageNumber = parseInt(page as string);
      const size = parseInt(pageSize as string);
      const startIndex = (pageNumber - 1) * size;
      const endIndex = startIndex + size;
      const paginatedExpenses = expenses.slice(startIndex, endIndex);

      res.json({
        totalExpenses: expenses.length,
        totalPages: Math.ceil(expenses.length / size),
        currentPage: page,
        pageSize: pageSize,
        expenses: paginatedExpenses,
      });
    } else {
      res.json({
        totalExpenses: expenses.length,
        expenses,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExpense = async (req: Request, res: Response): Promise<void> => {
  const expenseId = req.params.expenseId;
  try {
    const expenses: Expense[] = await readDataFromFile();
    const expense = expenses.find((exp: Expense) => exp.id === Number(expenseId));

    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedExpense: NewExpense | undefined = validateExpenseData(req, res);
    if (!validatedExpense) return;

    const expenses: Expense[] = await readDataFromFile();

    const id = expenses.length > 0 ? Math.max(...expenses.map((e: Expense) => e.id)) + 1 : 1;

    const newExpense = { id, ...validatedExpense };

    expenses.push(newExpense);

    await writeDataToFile(expenses);

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding new expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const validatedExpense: NewExpense | undefined = validateExpenseData(req, res);
    if (!validatedExpense) return;

    const expenses: Expense[] = await readDataFromFile();

    const index = expenses.findIndex((expense: Expense) => expense.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    Object.assign(expenses[index], validatedExpense);
    await writeDataToFile(expenses);

    res.json(expenses[index]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    const expenses: Expense[] = await readDataFromFile();

    const index = expenses.findIndex((expense: Expense) => expense.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Expense not found' });
      return;
    }

    expenses.splice(index, 1);

    await writeDataToFile(expenses);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
