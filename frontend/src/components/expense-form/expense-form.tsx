import { Component, Prop, State, h, Element } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { MatchResults, RouterHistory } from '@stencil-community/router';
import { ExpenseCategories } from '../../utils/constants';
import '../custom-button/custom-button';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

interface ErrorState {
  description?: string;
  amount?: string;
  category?: string;
  date?: string;
}

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
  @State() errors: ErrorState = {};
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

  private clearErrors() {
    this.errors = {};
  }

  private async handleSubmit(event: Event) {
    event.preventDefault();
    this.clearErrors();

    if (!this.description.trim()) {
      this.errors.description = 'Description is required';
    }

    if (!this.amount || this.amount <= 0) {
      this.errors.amount = 'Amount is required and cannot be 0 or negative';
    }

    if (!this.category) {
      this.errors.category = 'Category is required';
    }

    if (!this.date) {
      this.errors.date = 'Date is required';
    }

    if (Object.keys(this.errors).length > 0) {
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
    console.log('in handle input change');
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
            <custom-input
              type="text"
              placeholder="Add description..."
              value={this.description}
              onInput={(event: Event) => this.handleInputChange(event, 'description')}
            ></custom-input>
            <div class="error-message">{this.errors.description}</div>
          </div>
          <div class="input-group">
            <label>Amount($):</label>
            <custom-input type="number" value={this.amount} onInput={(event: Event) => this.handleInputChange(event, 'amount')}></custom-input>
            <div class="error-message">{this.errors.amount}</div>
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
            <div class="error-message">{this.errors.category}</div>
          </div>
          <div class="input-group">
            <label>Date:</label>
            <custom-input
              placeholder="Add date"
              type="text"
              value={this.date}
              class="datepicker"
              onInput={(event: Event) => this.handleInputChange(event, 'date')}
            ></custom-input>
            <div class="error-message">{this.errors.date}</div>
          </div>
          <button class="submit-button" type="submit">
            {this.mode === 'create' ? 'Create' : 'Update'}
          </button>
        </form>
      </div>
    );
  }
}
