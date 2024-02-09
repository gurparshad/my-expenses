import { MatchResults } from '@stencil-community/router';
import { Component, Prop, h } from '@stencil/core';
import { ExpenseApi } from '../../api';

@Component({
  tag: 'expense-details-two',
  styleUrl: 'expense-details-two.css',
  shadow: true,
})
export class ExpenseDetails {
  @Prop() match: MatchResults;

  private expenseApi: ExpenseApi;
  private expenseDetails: any = {};

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
        <div class="title">Expense Details</div>
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
            <span class="label">Date:</span>
            <span class="value">{this.expenseDetails.date}</span>
          </div>
        </div>
      </div>
    );
  }
}
