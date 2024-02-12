import { Component, Prop, State, h } from '@stencil/core';
import { ExpenseApi } from '../../api';
import { RouterHistory } from '@stencil-community/router';
import { Expense } from '../../types';

@Component({
  tag: 'expense-list',
  styleUrl: 'expense-list.css',
  shadow: true,
})
export class AppHome {
  @Prop() history: RouterHistory;
  @State() expenses: Expense[] = [];
  @State() currentPage: number = 1;
  @State() totalPages: number = 1;
  @State() pageSize: number = 15;
  @State() selectedCategory: string = '';
  @State() selectedMonth: string = '';
  @State() selectedYear: string = '';
  @State() startDate: string = '';
  @State() endDate: string = '';

  private expenseApi: ExpenseApi;

  constructor() {
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  async componentWillLoad() {
    const params = new URLSearchParams(window.location.search);
    this.currentPage = parseInt(params.get('page') || '1');
    this.selectedCategory = params.get('category') || '';
    this.startDate = params.get('startDate') || '2024-01-01';
    this.endDate = params.get('endDate') || '2024-12-31';
    this.selectedMonth = params.get('startDate') ? this.startDate.split('-')[1] : '';
    this.selectedYear = params.get('startDate') ? this.startDate.split('-')[0] : '2024';
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

  private async handleCategorySelect(event: Event) {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    const params = new URLSearchParams(window.location.search);
    params.set('category', this.selectedCategory);
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

  private handleRowClick(expenseId: number) {
    this.history.push(`/details/${expenseId}`);
  }

  private handleUpdateClick(expenseId: number) {
    this.history.push(`/edit/${expenseId}`);
  }

  private async handleDeleteClick(expenseId: number) {
    try {
      await this.expenseApi.deleteExpense(expenseId.toString());
      await this.fetchExpenses();
      setTimeout(() => {
        window.alert('Expense Deleted successfully!');
      }, 100);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }

  render() {
    return (
      <div class="app-home">
        <expense-list-filters
          selectedCategory={this.selectedCategory}
          selectedMonth={this.selectedMonth}
          selectedYear={this.selectedYear}
          handleCategorySelect={(event: Event) => this.handleCategorySelect(event)}
          handleMonthChange={(event: Event) => this.handleMonthChange(event)}
          handleYearChange={(event: Event) => this.handleYearChange(event)}
        ></expense-list-filters>
        {this.expenses.length === 0 ? (
          <p class="expenses-not-found">No Expenses found. Try changing the time period or category!!</p>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.expenses.map(expense => (
                  <tr key={expense.id} onClick={() => this.handleRowClick(expense.id)}>
                    <td>{expense.description}</td>
                    <td>{expense.amount}</td>
                    <td>{expense.category}</td>
                    <td>{expense.date}</td>
                    <td class="buttons-container">
                      <custom-button
                        color="secondary"
                        onClick={(event: Event) => {
                          event.stopPropagation();
                          this.handleUpdateClick(expense.id);
                        }}
                      >
                        EDIT
                      </custom-button>
                      <custom-button
                        color="danger"
                        onClick={(event: Event) => {
                          event.stopPropagation();
                          this.handleDeleteClick(expense.id);
                        }}
                      >
                        Delete
                      </custom-button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {this.totalPages > 1 && (
              <expense-pagination
                currentPage={this.currentPage}
                totalPages={this.totalPages}
                onPrevPage={() => this.prevPage()}
                onNextPage={() => this.nextPage()}
              ></expense-pagination>
            )}
          </div>
        )}
      </div>
    );
  }
}
