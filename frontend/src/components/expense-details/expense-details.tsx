import { MatchResults, RouterHistory } from '@stencil-community/router';
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
  @Prop() history: RouterHistory;

  private expenseId: string;
  private expenseApi: ExpenseApi;
  private expenseDetails: Expense = {
    id: 0,
    description: '',
    date: '',
    amount: 0,
    category: '',
  };

  private handleUpdateClick(expenseId: string) {
    this.history.push(`/edit/${expenseId}`);
  }

  private async handleDeleteClick(expenseId: string) {
    try {
      await this.expenseApi.deleteExpense(expenseId);
      setTimeout(() => {
        window.alert('Expense Deleted successfully!');
      }, 100);
      this.history.push('/');
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }

  async componentWillLoad() {
    this.expenseId = this.match.params.expenseId;
    this.expenseApi = new ExpenseApi();
    try {
      this.expenseDetails = await this.expenseApi.getExpense(this.expenseId);
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
            <span>{this.expenseDetails.description}</span>
          </div>
          <div class="field">
            <span class="label">Amount:</span>
            <span>{this.expenseDetails.amount}</span>
          </div>
          <div class="field">
            <span class="label">Category:</span>
            <span>{this.expenseDetails.category}</span>
          </div>
          <div class="field">
            <span class="label">Date:</span>
            <span>{this.expenseDetails.date}</span>
          </div>
        </div>
        <td class="buttons-container">
          <custom-button
            color="secondary"
            onClick={(event: Event) => {
              event.stopPropagation();
              this.handleUpdateClick(this.expenseId);
            }}
          >
            EDIT
          </custom-button>
          <custom-button
            color="danger"
            onClick={(event: Event) => {
              event.stopPropagation();
              this.handleDeleteClick(this.expenseId);
            }}
          >
            Delete
          </custom-button>
        </td>
      </div>
    );
  }
}
