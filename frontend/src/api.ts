import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export class ExpenseApi {
  private client: AxiosInstance;

  private routes = {
    CREATE_EXPENSE: "expenses",
    GET_EXPENSES: "expenses",
    GET_EXPENSE: (expense_id: string) => `expenses/${expense_id}`,
    UPDATE_EXPENSE: (expense_id: string) => `expenses/${expense_id}`,
    DELETE_EXPENSE: (expense_id: string) => `expenses/${expense_id}`,
    GET_EXPENSE_CATEGORIES: 'expense/categories'
  };

  private handleRequest = async (request: Promise<AxiosResponse<any>>) =>
    request.then(this.handleResult).catch(this.handleError);

  private handleError(err: AxiosError) {
    //@ts-ignore
    throw new Error(err?.response?.data?.message);
  }

  private handleResult(res: AxiosResponse) {
    return res.data;
  }

  constructor() {
    this.client = axios.create({
      baseURL: "http://localhost:3000"
    });
  }

  public createExpense = async (description: string, amount: number, category: string, date: string) => {
    console.log('in api')
    return await this.handleRequest(
      this.client.post(this.routes.CREATE_EXPENSE, {
        description,
        amount,
        category,
        date
      })
    );
  };

  public updateExpense = async (id: number, description: string, amount: number, category: string) => {
    return await this.handleRequest(
      this.client.patch(this.routes.UPDATE_EXPENSE(id.toString()), {
        description,
        amount,
        category
      })
    );
  };

  public getCategories = async () => {
    return await this.handleRequest(
      this.client.get(this.routes.GET_EXPENSE_CATEGORIES)
    );
  }

  // TODO: check if we have to add optional arguments or not.
  public getExpenses = async (pageNumber?: number, pageSize?: number, category?: string, startDate?: string, endDate?: string) => {
    return await this.handleRequest(
      this.client.get(this.routes.GET_EXPENSES, {
        params: {
          page: pageNumber,
          pageSize: pageSize,
          category: category,
          startDate: startDate,
          endDate: endDate
        },
      })
    );
  };

  public getExpense = async (expense_id: string) => {
    return await this.handleRequest(
      this.client.get(this.routes.GET_EXPENSE(expense_id))
    );
  };

  public deleteExpense = async (expense_id: number) => {
    return await this.handleRequest(
      this.client.delete(this.routes.DELETE_EXPENSE(expense_id.toString()))
    );
  };

}
