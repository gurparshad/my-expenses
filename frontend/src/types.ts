export interface Expense {
  id: number;
  description: string;
  date: string;
  amount: number;
  category: string;
}

export interface ExpensesData {
  totalExpenses: number;
  expenses: Expense[];
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
}

export interface Month {
  value: string;
  label: string;
}
