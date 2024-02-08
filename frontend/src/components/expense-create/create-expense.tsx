import { Component, Prop, State, h } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { RouterHistory } from '@stencil-community/router';

@Component({
  tag: 'create-expense',
  styleUrl: 'create-expense.css',
  shadow: true,
})
export class CreateExpense {
  @Prop() history: RouterHistory;
  @State() description: string = '';
  @State() amount: number;
  @State() descriptionError: string = '';
  @State() amountError: string = '';

  private expenseApi: ExpenseApi;

  componentWillLoad() {
    this.expenseApi = new ExpenseApi();
  }

  private async createExpense() {
    this.descriptionError = '';
    this.amountError = '';

    if (!this.description.trim()) {
      this.descriptionError = 'Description is required';
    }

    if (!this.amount) {
      this.amountError = 'Amount is required';
    }

    if (this.descriptionError || this.amountError) {
      return;
    }

    try {
      await this.expenseApi.createExpense(this.description, this.amount);
      console.log('Expense created successfully!');
      this.history.push('/');
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  }

  render() {
    return (
      <div class="create-expense">
        <h2>Create Expense</h2>
        <div class="input-group">
          <label>Description:</label>
          <input type="text" value={this.description} onInput={(event: any) => (this.description = event.target.value)} />
          <div class="error-message">{this.descriptionError}</div>
        </div>
        <div class="input-group">
          <label>Amount:</label>
          <input type="number" value={this.amount} onInput={(event: any) => (this.amount = parseFloat(event.target.value))} />
          <div class="error-message">{this.amountError}</div>
        </div>
        <button onClick={() => this.createExpense()}>Create</button>
      </div>
    );
  }
}
