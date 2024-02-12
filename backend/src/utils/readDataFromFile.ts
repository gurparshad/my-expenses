import fs from 'fs';
import path from 'path';

export const readDataFromFile = () => {
  const jsonFilePath = path.join(__dirname, '../data/expenses.json');
  try {
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw new Error('Internal server error');
  }
};
