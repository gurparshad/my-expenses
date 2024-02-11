import { Component, Prop, State, h } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { RouterHistory } from '@stencil-community/router';
import { ExpenseCategory } from '../../utils/constants';
import '../custom-button/custom-button';

@Component({
  tag: 'create-expense',
  styleUrl: 'create-expense.css',
  shadow: true,
})
export class CreateExpense {
  @Prop() history: RouterHistory;
  @State() description: string = '';
  @State() amount: number = 0;
  @State() category: string = '';
  @State() descriptionError: string = '';
  @State() amountError: string = '';
  @State() categoryError: string = '';

  private expenseApi: ExpenseApi;

  componentWillLoad() {
    this.expenseApi = new ExpenseApi();
  }

  private async createExpense() {
    console.log('in create expense');
    this.descriptionError = '';
    this.amountError = '';
    this.categoryError = '';

    if (!this.description.trim()) {
      this.descriptionError = 'Description is required';
    }

    if (!this.amount) {
      this.amountError = 'Amount is required';
    }

    if (!this.category) {
      this.categoryError = 'Category is required';
    }

    if (this.descriptionError || this.amountError || this.categoryError) {
      return;
    }

    try {
      await this.expenseApi.createExpense(this.description, this.amount, this.category);
      this.history.push('/');
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  }

  private handleInputChange(event: Event, property: string) {
    let value = (event.target as HTMLInputElement).value;
    if (property === 'amount') {
      this[property] = Number(value);
    } else {
      value = value.trim();
      this[property] = value;
    }
  }

  private handleCategoryChange(event: Event) {
    this.category = (event.target as HTMLSelectElement).value;
  }

  render() {
    return (
      // TODO: use form here
      <div class="create-expense">
        <h2>Create Expense</h2>
        <div class="input-group">
          <label>Description:</label>
          <input type="text" value={this.description} onInput={(event: Event) => this.handleInputChange(event, 'description')} />
          <div class="error-message">{this.descriptionError}</div>
        </div>
        <div class="input-group">
          <label>Amount:</label>
          <input type="number" value={this.amount} onInput={(event: Event) => this.handleInputChange(event, 'amount')} />
          <div class="error-message">{this.amountError}</div>
        </div>
        <div class="input-group">
          <label>Category:</label>
          <select class="category-select" id="expense-category-select" onChange={(event: Event) => this.handleCategoryChange(event)}>
            <option value="">Select category</option>
            {Object.values(ExpenseCategory).map(category => (
              <option value={category}>{category}</option>
            ))}
          </select>
          <div class="error-message">{this.categoryError}</div>
        </div>
        <custom-button color="secondary" onClick={() => this.createExpense()}>
          Create
        </custom-button>
      </div>
    );
  }
}
