import express, { Request, Response } from "express";
import fs from 'fs';
import path from 'path';

const expensesRouter = express.Router();

const jsonFilePath = path.join(__dirname, '../../data/expenses.json');

expensesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const expenses = JSON.parse(jsonData);
    res.json(expenses);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

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