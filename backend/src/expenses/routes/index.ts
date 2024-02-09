import express, { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

const expensesRouter = express.Router();

const jsonFilePath = path.join(__dirname, '../../data/expenses.json');

// TODO: Expenses need pagination
expensesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, category, page, pageSize } = req.query;
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    let expenses = JSON.parse(jsonData);
    if (startDate && endDate) {
      expenses = expenses.filter((expense: any) => {
        const expenseDate = new Date(expense.date);
        // @ts-ignore
        const startDateObj = new Date(startDate);
        // @ts-ignore
        const endDateObj = new Date(endDate);
        return expenseDate >= startDateObj && expenseDate <= endDateObj;
      });
    }

    if (category) {
      expenses = expenses.filter((expense: any) => expense.category === category);
    }

    if (page && pageSize) {
      const pageNumber = parseInt(page as string, 10);
      const size = parseInt(pageSize as string, 10);
      const startIndex = (pageNumber - 1) * size;
      const endIndex = startIndex + size;
      console.log("startIndex-->>", startIndex)
      console.log("endIndex-->>", endIndex)
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
        expenses: expenses,
      });
    }




  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

expensesRouter.get('/:expenseId', async (req: Request, res: Response) => {
  const expenseId = req.params.expenseId;
  try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const expenses = JSON.parse(jsonData);
    console.log("expenses->>", expenses);
    console.log("type fo -->>", typeof expenseId)
    const expense = expenses.find((exp: any) => exp.id === Number(expenseId));
    console.log("expense-->>", expense);

    if (expense) {
      res.json(expense);
    } else {
      res.status(404).json({ error: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

expensesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { description, amount } = req.body;
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const expenses = JSON.parse(jsonData);

    const currentDate = new Date().toISOString().split('T')[0];

    const id = expenses.length > 0 ? Math.max(...expenses.map((e: any) => e.id)) + 1 : 1;

    const newExpense = { id, description, date: currentDate, amount };

    expenses.push(newExpense);

    fs.writeFileSync(jsonFilePath, JSON.stringify(expenses, null, 2), 'utf8');

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Error adding new expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

expensesRouter.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { description, amount } = req.body;
    console.log("description, amount", description, amount);

    const currentDate = new Date().toISOString().split('T')[0];

    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    let expenses = JSON.parse(jsonData);

    const index = expenses.findIndex((expense: any) => expense.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expenses[index].description = description;
    expenses[index].amount = amount;
    expenses[index].date = currentDate;

    fs.writeFileSync(jsonFilePath, JSON.stringify(expenses, null, 2), 'utf8');

    res.json(expenses[index]);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

expensesRouter.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    let expenses = JSON.parse(jsonData);

    const index = expenses.findIndex((expense: any) => expense.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expenses.splice(index, 1);

    fs.writeFileSync(jsonFilePath, JSON.stringify(expenses, null, 2), 'utf8');

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




export default expensesRouter;