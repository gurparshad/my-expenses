export interface Expense {
  id: number;
  description: string;
  date: string;
  amount: number;
  category: string;
}

export interface NewExpense {
  description: string;
  date: string;
  amount: number;
  category: string;
}