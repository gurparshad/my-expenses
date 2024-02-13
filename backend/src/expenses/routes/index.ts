import express from 'express';
import { createExpense, deleteExpense, getExpense, getExpenses, updateExpense } from '../controllers';

const expensesRouter = express.Router();

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Retrieve a list of expenses
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of expenses
 */
expensesRouter.get('/', getExpenses);

/**
 * @swagger
 * /expenses/{expenseId}:
 *   get:
 *     summary: Retrieve an expense by ID
 *     parameters:
 *       - in: path
 *         name: expenseId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the expense to retrieve
 *     responses:
 *       200:
 *         description: The requested expense
 *       404:
 *         description: Expense not found
 */
expensesRouter.get('/:expenseId', getExpense);

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: The created expense
 */
expensesRouter.post('/', createExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update an existing expense
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the expense to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: The updated expense
 *       404:
 *         description: Expense not found
 */
expensesRouter.put('/:id', updateExpense);

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Delete an expense by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the expense to delete
 *     responses:
 *       204:
 *         description: Expense deleted successfully
 *       404:
 *         description: Expense not found
 */
expensesRouter.delete('/:id', deleteExpense);

export default expensesRouter;
