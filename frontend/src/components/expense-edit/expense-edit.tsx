import { MatchResults, RouterHistory } from '@stencil-community/router';
import { Component, Prop, State, h, Element } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { ExpenseCategory } from '../../utils/constants';
import { Expense } from '../../types';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

@Component({
  tag: 'expense-edit',
  styleUrl: 'expense-edit.css',
  shadow: true,
})
export class ExpenseDetails {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;
  @State() expenseDetails: Expense;
  @State() descriptionError: string = '';
  @State() amountError: string = '';
  @State() categoryError: string = '';
  @State() dateError: string = '';
  @Element() private element: HTMLElement;

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

  componentDidLoad() {
    const options = {};
    const input = this.element.shadowRoot.querySelector('.datepicker') as HTMLInputElement;
    flatpickr(input, options);
  }

  private async handleUpdate() {
    this.descriptionError = '';
    this.amountError = '';
    this.categoryError = '';
    this.dateError = '';

    if (!this.expenseDetails.description.trim()) {
      this.descriptionError = 'Description is required';
    }

    if (!this.expenseDetails.amount) {
      this.amountError = 'Amount is required';
    }

    if (!this.expenseDetails.category) {
      this.categoryError = 'Category is required';
    }

    if (!this.expenseDetails.date) {
      this.dateError = 'Date is required';
    }

    if (this.descriptionError || this.amountError || this.categoryError || this.dateError) {
      return;
    }
    try {
      await this.expenseApi.updateExpense(
        this.expenseDetails.id,
        this.expenseDetails.description,
        this.expenseDetails.amount,
        this.expenseDetails.category,
        this.expenseDetails.date,
      );
      this.history.push('/');
      setTimeout(() => {
        window.alert('Expense created successfully!');
      }, 100);
    } catch (error) {
      console.error('Error creating expense:', error);
    }
  }

  private handleInputChange(event: Event, property: string) {
    let value = (event.target as HTMLInputElement).value;
    value = value.trim();
    if (property === 'amount') {
      this.expenseDetails.amount = Number(value);
    } else if (property === 'description') {
      this.expenseDetails.description = value;
    } else {
      this.expenseDetails.date = value;
    }
  }

  private handleCategoryChange(event: Event) {
    this.expenseDetails.category = (event.target as HTMLSelectElement).value;
  }

  render() {
    return (
      <div class="edit-expense">
        <h2>Edit Expense</h2>
        <div class="input-group">
          <label>Description:</label>
          <input type="text" value={this.expenseDetails.description} onInput={(event: Event) => this.handleInputChange(event, 'description')} />
          <div class="error-message">{this.descriptionError}</div>
        </div>
        <div class="input-group">
          <label>Amount:</label>
          <input type="number" value={this.expenseDetails.amount} onInput={(event: Event) => this.handleInputChange(event, 'amount')} />
          <div class="error-message">{this.amountError}</div>
        </div>
        <div class="input-group">
          <label>Category:</label>
          <select class="category-select" id="expense-category-select" onChange={(event: Event) => this.handleCategoryChange(event)}>
            <option value="">Select category</option>
            {Object.values(ExpenseCategory).map(category => (
              <option value={category} selected={this.expenseDetails.category === category}>
                {category}
              </option>
            ))}
          </select>
          <div class="error-message">{this.categoryError}</div>
        </div>
        <div class="input-group">
          <label>Date:</label>
          <input type="text" class="datepicker" value={this.expenseDetails.date} onInput={(event: Event) => this.handleInputChange(event, 'date')} />
          <div class="error-message">{this.dateError}</div>
        </div>
        <custom-button color="secondary" onClick={() => this.handleUpdate()}>
          Update
        </custom-button>
      </div>
    );
  }
}
