import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export class ExpenseApi {
  private client: AxiosInstance;

  private routes = {
    CREATE_EXPENSE: "expenses",
    GET_EXPENSES: "expenses",
    GET_EXPENSE: (expense_id: string) => `expenses/${expense_id}`,
    UPDATE_EXPENSE: (expense_id: string) => `expenses/${expense_id}`,
    DELETE_EXPENSE: (expense_id: string) => `expenses/${expense_id}`,
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

  public createExpense = async (description: string, amount: number) => {
    return await this.handleRequest(
      this.client.post(this.routes.CREATE_EXPENSE, {
        description,
        amount,
      })
    );
  };

  // TODO: update the update method
  public updateExpense = async (description: string, amount: number) => {
    return await this.handleRequest(
      this.client.put(this.routes.CREATE_EXPENSE, {
        description: description,
        amount,
      })
    );
  };

  public getExpenses = async () => {
    return await this.handleRequest(
      this.client.get(this.routes.GET_EXPENSES)
    );
  };

  public getExpense = async () => {
    return await this.handleRequest(
      this.client.get(this.routes.GET_EXPENSES)
    );
  };

  // TODO: update the delete method
  // public deleteExpense = async (id: number) => {
  //   return await this.handleRequest(
  //     this.client.delete(this.routes.GET_EXPENSES)
  //   );
  // };

}
