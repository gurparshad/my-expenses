import { ExpenseCategory } from '../../utils/constants';
import { readDataFromFile } from '../../utils/readDataFromFile';
import { Expense } from '../../utils/types';
import { Request, Response } from 'express';
import { writeDataToFile } from '../../utils/writeDataToFile';

export const getExpenses = async (req: Request, res: Response) => {
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

export const getExpense = async (req: Request, res: Response) => {
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

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ error: 'Description, amount, category and Date are required fields and amount must not be zero.' });
    }

    if (!Object.values(ExpenseCategory).includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Please provide one of the predefined categories' });
    }

    const expenses: Expense[] = await readDataFromFile();

    const id = expenses.length > 0 ? Math.max(...expenses.map((e: Expense) => e.id)) + 1 : 1;

    const newExpense = { id, description, date, amount, category };

    expenses.push(newExpense);

    await writeDataToFile(expenses);

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding new expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { description, amount, category, date } = req.body;
    console.log('description, amount, category, date-->>', description, amount, category, date);

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ error: 'Description, amount, category and Date are required fields and amount must not be zero.' });
    }

    if (!Object.values(ExpenseCategory).includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Please provide one of the predefined categories' });
    }

    const expenses: Expense[] = await readDataFromFile();

    const index = expenses.findIndex((expense: Expense) => expense.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expenses[index].description = description ?? expenses[index].description;
    expenses[index].amount = amount ?? expenses[index].amount;
    expenses[index].date = date ?? expenses[index].date;
    expenses[index].category = category ?? expenses[index].category;

    await writeDataToFile(expenses);

    res.json(expenses[index]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    const expenses: Expense[] = await readDataFromFile();

    const index = expenses.findIndex((expense: Expense) => expense.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expenses.splice(index, 1);

    await writeDataToFile(expenses);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
