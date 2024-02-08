import { Component, Prop, h } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { RouterHistory } from '@stencil-community/router';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  @Prop() history: RouterHistory;

  private expenseApi: ExpenseApi;
  private expenses: any[] = [];

  constructor() {
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  async componentWillLoad() {
    this.expenseApi = new ExpenseApi();
    try {
      this.expenses = await this.expenseApi.getExpenses();
      console.log('Expenses:', this.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  handleRowClick(expenseId: string) {
    this.history.push(`/details/${expenseId}`);
  }

  async handleDeleteClick(expenseId: string) {
    console.log('Deleting expense:', expenseId);
    try {
      await this.expenseApi.deleteExpense(expenseId);
      // i think we should fetch the list again from database.
      this.expenses = this.expenses.filter(expense => expense.id !== expenseId);
      console.log('Expense deleted successfully.');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }

  render() {
    return (
      <div class="app-home">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {this.expenses.map(expense => (
              <tr key={expense.id} onClick={() => this.handleRowClick(expense.id)}>
                <td>{expense.id}</td>
                <td>{expense.id}</td>
                <td>{expense.description}</td>
                <td>{expense.date}</td>
                <td>{expense.amount}</td>
                <td>
                  <button
                    onClick={(event: Event) => {
                      event.stopPropagation();
                      this.handleDeleteClick(expense.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
