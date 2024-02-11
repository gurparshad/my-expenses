import express, { Request, Response } from "express";
import { readDataFromFile } from "../../utils/readDataFromFile";
import { writeDataToFile } from "../../utils/writeDataToFile";
import { Expense } from "../../utils/types";
import { ExpenseCategory } from "../../utils/constants";

const expensesRouter = express.Router();

expensesRouter.get('/', async (req: Request, res: Response) => {
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
      const pageNumber = parseInt(page as string, 10);
      const size = parseInt(pageSize as string, 10);
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
    }

    else {
      res.json({
        totalExpenses: expenses.length,
        expenses,
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

expensesRouter.get('/:expenseId', async (req: Request, res: Response) => {
  const expenseId = req.params.expenseId;
  try {
    let expenses: Expense[] = await readDataFromFile();
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
});

expensesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { description, amount, category } = req.body;

    if (!description || !amount || !category) {
      return res.status(400).json({ error: 'Description, amount, and category are required fields and amount must not be zero.' });
    }

    if (!Object.values(ExpenseCategory).includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Please provide one of the predefined categories' });
    }

    let expenses: Expense[] = await readDataFromFile();

    const currentDate = new Date().toISOString().replace('T', ' ').split('.')[0];

    const id = expenses.length > 0 ? Math.max(...expenses.map((e: Expense) => e.id)) + 1 : 1;

    const newExpense = { id, description, date: currentDate, amount, category };

    expenses.push(newExpense);

    await writeDataToFile(expenses);

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding new expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

expensesRouter.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { description, amount, category } = req.body;

    if (amount === 0) {
      return res.status(400).json({ error: 'The amount must not be zero' });
    }

    if (!description.length) {
      return res.status(400).json({ error: 'The description must not be empty' });
    }

    if (!Object.values(ExpenseCategory).includes(category)) {
      return res.status(400).json({ error: 'Invalid category. Please provide one of the predefined categories' });
    }

    let expenses: Expense[] = await readDataFromFile();

    const index = expenses.findIndex((expense: Expense) => expense.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expenses[index].description = description !== undefined && description.trim() !== '' ? description : expenses[index].description;
    expenses[index].amount = amount ?? expenses[index].amount
    expenses[index].date = expenses[index].date;
    expenses[index].category = category !== undefined && category.trim() !== '' ? category : expenses[index].category;

    await writeDataToFile(expenses);

    res.json(expenses[index]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

expensesRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    let expenses: Expense[] = await readDataFromFile();

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
});

export default expensesRouter;