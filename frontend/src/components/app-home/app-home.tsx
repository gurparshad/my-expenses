import { Component, Prop, State, h } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { RouterHistory } from '@stencil-community/router';
import { generateYears } from '../../utils/generateYears';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  @Prop() history: RouterHistory;
  @State() expenses: any[] = [];
  @State() currentPage: number = 1;
  @State() totalPages: number = 1;
  @State() pageSize: number = 15;
  @State() selectedCategory: string = '';
  @State() selectedMonth: string = '';
  @State() selectedYear: string = '2024';
  @State() startDate: string = '';
  @State() endDate: string = '';

  private categories = [
    'food-and-dining',
    'transportation',
    'housing',
    'utilities',
    'entertainment',
    'health-and-fitness',
    'shopping',
    'travel',
    'education',
    'personal-care',
    'others',
  ];

  private months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  private years = generateYears();

  private expenseApi: ExpenseApi;

  constructor() {
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  async componentWillLoad() {
    const params = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(params.get('page') || '1');
    this.selectedCategory = params.get('category') || '';
    this.startDate = params.get('startDate') || '';
    this.endDate = params.get('endDate') || '';
    this.selectedMonth = this.startDate ? this.startDate.split('-')[1] : '';
    this.selectedYear = this.startDate ? this.startDate.split('-')[0] : '';
    await this.fetchExpenses();
  }

  private async fetchExpenses() {
    try {
      this.expenseApi = new ExpenseApi();
      const response = await this.expenseApi.getExpenses(this.currentPage, this.pageSize, this.selectedCategory, this.startDate, this.endDate);
      this.expenses = response.expenses;
      this.totalPages = response.totalPages;
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  private handleMonthChange(event: Event) {
    this.selectedMonth = (event.target as HTMLSelectElement).value;
    if (this.selectedMonth) {
      this.startDate = `${this.selectedYear}-${this.selectedMonth}-01`;
      // TODO: need a logic to add 31,30 or 28
      this.endDate = `${this.selectedYear}-${this.selectedMonth}-31`;
    } else {
      this.startDate = `${this.selectedYear}-01-01`;
      this.endDate = `${this.selectedYear}-12-31`;
    }
    const params = new URLSearchParams(window.location.search);
    params.set('startDate', this.startDate);
    params.set('endDate', this.endDate);
    this.history.push(window.location.pathname + '?' + params.toString());
    this.fetchExpenses();
  }

  private handleYearChange(event: Event) {
    this.selectedYear = (event.target as HTMLSelectElement).value;
    if (this.selectedMonth) {
      this.startDate = `${this.selectedYear}-${this.selectedMonth}-01`;
      this.endDate = `${this.selectedYear}-${this.selectedMonth}-31`;
    } else {
      this.startDate = `${this.selectedYear}-01-01`;
      this.endDate = `${this.selectedYear}-12-31`;
    }
    const params = new URLSearchParams(window.location.search);
    params.set('startDate', this.startDate);
    params.set('endDate', this.endDate);
    this.history.push(window.location.pathname + '?' + params.toString());
    this.fetchExpenses();
  }

  private async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      const params = new URLSearchParams(window.location.search);
      params.set('page', this.currentPage.toString());
      this.history.push(window.location.pathname + '?' + params.toString());
      await this.fetchExpenses();
    }
  }

  private async prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const params = new URLSearchParams(window.location.search);
      params.set('page', this.currentPage.toString());
      this.history.push(window.location.pathname + '?' + params.toString());
      await this.fetchExpenses();
    }
  }

  private async handleCategorySelect(event: any) {
    this.selectedCategory = event.target.value;
    const params = new URLSearchParams(window.location.search);
    params.set('category', this.selectedCategory);
    this.history.push(window.location.pathname + '?' + params.toString());
    this.fetchExpenses();
  }

  handleRowClick(expenseId: string) {
    this.history.push(`/details/${expenseId}`);
  }

  private async handleDeleteClick(expenseId: string) {
    try {
      await this.expenseApi.deleteExpense(expenseId);
      // Fetch expenses again after deletion
      await this.fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }

  render() {
    return (
      <div class="app-home">
        <div class="filter">
          <label htmlFor="category-select">Select Category:</label>
          <select id="category-select" onChange={event => this.handleCategorySelect(event)}>
            <option value="">All</option>
            {/* need a key in the map */}
            {this.categories.map(category => (
              <option value={category}>{category}</option>
            ))}
          </select>
          <label htmlFor="month-select">Select Month:</label>
          <select id="month-select" onChange={event => this.handleMonthChange(event)}>
            <option value="">All</option>
            {this.months.map(month => (
              <option value={month.value} selected={this.selectedMonth === month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <label htmlFor="year-select">Select Year:</label>
          <select id="year-select" onChange={event => this.handleYearChange(event)}>
            {this.years.map(year => (
              <option value={year} selected={Number(this.selectedYear) === year}>
                {year}
              </option>
            ))}
          </select>
        </div>
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
              <tr key={expense.id} onClick={() => this.handleRowClick(expense.id)}>
                <td>{expense.id}</td>
                <td>{expense.description}</td>
                <td>{expense.date}</td>
                <td>{expense.amount}</td>
                <td>
                  <button
                    onClick={(event: Event) => {
                      event.stopPropagation();
                      this.handleDeleteClick(expense.id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div class="pagination">
          <button onClick={() => this.prevPage()} disabled={this.currentPage === 1}>
            Previous
          </button>
          <span>
            Page {this.currentPage} of {this.totalPages}
          </span>
          <button onClick={() => this.nextPage()} disabled={this.currentPage === this.totalPages}>
            Next
          </button>
        </div>
      </div>
    );
  }
}
