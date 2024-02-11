import { MatchResults, RouterHistory } from '@stencil-community/router';
import { Component, Prop, State, h } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { ExpenseCategory } from '../../utils/constants';

@Component({
  tag: 'expense-edit',
  styleUrl: 'expense-edit.css',
  shadow: true,
})
export class ExpenseDetails {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;
  @State() expenseDetails: any = {};
  @State() descriptionError: string = '';
  @State() amountError: string = '';
  @State() categoryError: string = '';

  private expenseApi: ExpenseApi;

  async componentWillLoad() {
    const expenseId = this.match.params.expenseId;
    this.expenseApi = new ExpenseApi();
    try {
      this.expenseDetails = await this.expenseApi.getExpense(expenseId);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  private async handleUpdate() {
    this.descriptionError = '';
    this.amountError = '';
    this.categoryError = '';

    if (!this.expenseDetails.description.trim()) {
      this.descriptionError = 'Description is required';
    }

    if (!this.expenseDetails.amount) {
      this.amountError = 'Amount is required';
    }

    if (!this.expenseDetails.category) {
      this.categoryError = 'Category is required';
    }

    if (this.descriptionError || this.amountError || this.categoryError) {
      return;
    }
    try {
      await this.expenseApi.updateExpense(this.expenseDetails.id, this.expenseDetails.description, this.expenseDetails.amount, this.expenseDetails.category);
      this.history.push('/');
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  }

  render() {
    return (
      <div class="edit-expense">
        <h2>Edit Expense</h2>
        <div class="input-group">
          <label>Description:</label>
          <input type="text" value={this.expenseDetails.description} onInput={(event: any) => (this.expenseDetails.description = event.target.value)} />
          <div class="error-message">{this.descriptionError}</div>
        </div>
        <div class="input-group">
          <label>Amount:</label>
          <input type="number" value={this.expenseDetails.amount} onInput={(event: any) => (this.expenseDetails.amount = parseFloat(event.target.value))} />
          <div class="error-message">{this.amountError}</div>
        </div>
        <div class="input-group">
          <label>Category:</label>
          <select class="category-select" id="expense-category-select" onChange={(event: any) => (this.expenseDetails.category = event.target.value)}>
            <option value="">Select category</option>
            {Object.values(ExpenseCategory).map(category => (
              <option value={category} selected={this.expenseDetails.category === category}>
                {category}
              </option>
            ))}
          </select>
          <div class="error-message">{this.categoryError}</div>
        </div>
        <custom-button color="secondary" onClick={() => this.handleUpdate()}>
          Update
        </custom-button>
      </div>
    );
  }
}
