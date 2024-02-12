import { MatchResults } from '@stencil-community/router';
import { Component, Prop, h } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { Expense } from '../../types';

@Component({
  tag: 'expense-details',
  styleUrl: 'expense-details.css',
  shadow: true,
})
export class ExpenseDetails {
  @Prop() match: MatchResults;

  private expenseApi: ExpenseApi;
  private expenseDetails: Expense = {
    id: 0,
    description: '',
    date: '',
    amount: 0,
    category: '',
  };

  async componentWillLoad() {
    const expenseId = this.match.params.expenseId;
    this.expenseApi = new ExpenseApi();
    try {
      this.expenseDetails = await this.expenseApi.getExpense(expenseId);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  render() {
    return (
      <div class="expense-details">
        <h2>Expense Details</h2>
        <div class="details">
          <div class="field">
            <span class="label">Description:</span>
            <span class="value">{this.expenseDetails.description}</span>
          </div>
          <div class="field">
            <span class="label">Amount:</span>
            <span class="value">{this.expenseDetails.amount}</span>
          </div>
          <div class="field">
            <span class="label">Category:</span>
            <span class="value">{this.expenseDetails.category}</span>
          </div>
          <div class="field">
            <span class="label">Date:</span>
            <span class="value">{this.expenseDetails.date}</span>
          </div>
        </div>
      </div>
    );
  }
}