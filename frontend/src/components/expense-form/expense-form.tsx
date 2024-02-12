import { Component, Prop, State, h, Element } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { MatchResults, RouterHistory } from '@stencil-community/router';
import { ExpenseCategories } from '../../utils/constants';
import '../custom-button/custom-button';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

@Component({
  tag: 'expense-form',
  styleUrl: 'expense-form.css',
  shadow: true,
})
export class CreateExpense {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;
  @Prop() mode: 'create' | 'edit';
  @State() expenseId: string = '';
  @State() description: string = '';
  @State() amount: number = 0;
  @State() category: string = '';
  @State() date: string = '';
  @State() descriptionError: string = '';
  @State() amountError: string = '';
  @State() categoryError: string = '';
  @State() dateError: string = '';
  @Element() private element: HTMLElement;

  private expenseApi: ExpenseApi;

  async componentWillLoad() {
    this.expenseApi = new ExpenseApi();
    if (this.mode === 'edit') {
      this.expenseId = this.match.params.expenseId;
      try {
        const { amount, category, date, description } = await this.expenseApi.getExpense(this.expenseId);
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.description = description;
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    }
  }

  componentDidLoad() {
    const input = this.element.shadowRoot.querySelector('.datepicker') as HTMLInputElement;
    flatpickr(input);
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    this.descriptionError = '';
    this.amountError = '';
    this.categoryError = '';
    this.dateError = '';

    if (!this.description.trim()) {
      this.descriptionError = 'Description is required';
    }

    if (!this.amount) {
      this.amountError = 'Amount is required';
    }

    if (!this.category) {
      this.categoryError = 'Category is required';
    }

    if (!this.date) {
      this.dateError = 'Date is required';
    }

    if (this.descriptionError || this.amountError || this.categoryError) {
      return;
    }

    try {
      if (this.mode === 'create') {
        await this.expenseApi.createExpense(this.description, this.amount, this.category, this.date);
      } else {
        await this.expenseApi.updateExpense(this.expenseId, this.description, this.amount, this.category, this.date);
      }
      setTimeout(() => {
        window.alert('Expense created successfully!');
      }, 500);
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
      <div class="create-expense">
        <h2>{this.mode === 'create' ? 'Create Expense' : 'Edit Expense'}</h2>
        <form onSubmit={(event: Event) => this.handleSubmit(event)}>
          <div class="input-group">
            <label>Description:</label>
            <input type="text" placeholder="Add description..." value={this.description} onInput={(event: Event) => this.handleInputChange(event, 'description')} />
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
              {Object.values(ExpenseCategories).map(category => (
                <option key={category} value={category} selected={this.category === category}>
                  {category}
                </option>
              ))}
            </select>
            <div class="error-message">{this.categoryError}</div>
          </div>
          <div class="input-group">
            <label>Date:</label>
            <input placeholder="Add date" type="text" value={this.date} class="datepicker" onInput={(event: Event) => this.handleInputChange(event, 'date')} />
            <div class="error-message">{this.dateError}</div>
          </div>
          <button class="submit-button" type="submit">
            {this.mode === 'create' ? 'Create' : 'Update'}
          </button>
        </form>
      </div>
    );
  }
}
