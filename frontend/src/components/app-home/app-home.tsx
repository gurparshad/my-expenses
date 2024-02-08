import { Component, h } from '@stencil/core';
import { ExpenseApi } from '../../api';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  private expenseApi: ExpenseApi;
  private expenses: any[] = [];

  async componentWillLoad() {
    this.expenseApi = new ExpenseApi();
    try {
      this.expenses = await this.expenseApi.getExpenses();
      console.log('Expenses:', this.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
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
              <tr key={expense.id}>
                <td>{expense.id}</td>
                <td>{expense.description}</td>
                <td>{expense.date}</td>
                <td>{expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
