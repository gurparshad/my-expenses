import fs from 'fs';
import path from 'path';
import { Expense } from '../../utils/types';

export const writeDataToFile = (data: Expense[]) => {
  const jsonFilePath = path.join(__dirname, '../../data/expenses.json');
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to JSON file:', error);
    throw new Error('Internal server error');
  }
};
