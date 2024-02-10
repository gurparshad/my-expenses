import { Component, Prop, State, h } from '@stencil/core';
import Chart from 'chart.js/auto';
import { ExpenseApi } from '../../api';
import { RouterHistory } from '@stencil-community/router';
import { generateYears } from '../../utils/generateYears';

@Component({
  tag: 'expense-chart',
  styleUrl: 'expense-chart.css',
  shadow: true,
})
export class ExpenseChart {
  @Prop() history: RouterHistory;
  @State() selectedYear: string = '';
  @State() startDate: string = '';
  @State() endDate: string = '';
  private canvasRef: HTMLCanvasElement;
  private expenseApi: ExpenseApi;
  private expenses: any;

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

  private months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private years = generateYears();
  private async fetchExpenses() {
    console.log('in fetch expenses');
    try {
      this.expenseApi = new ExpenseApi();
      this.expenses = await this.expenseApi.getExpenses(undefined, undefined, undefined, this.startDate, this.endDate);
      console.log('this.expenses--->>', this.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  private calculateMonthlyCategoryExpenses() {
    const monthlyCategoryExpenses: { [month: string]: { [category: string]: number } } = {};
    console.log('this.expenses.expenses-->>', this.expenses);
    this.expenses.expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      const category = expense.category;

      if (!monthlyCategoryExpenses[month]) {
        monthlyCategoryExpenses[month] = {};
      }

      if (!monthlyCategoryExpenses[month][category]) {
        monthlyCategoryExpenses[month][category] = 0;
      }

      monthlyCategoryExpenses[month][category] += expense.amount;
    });
    console.log('monthlyCategoryExpenses-->>', monthlyCategoryExpenses);
    return monthlyCategoryExpenses;
  }

  private async handleYearChange(event: Event) {
    console.log('inside handleYearChange');
    this.selectedYear = (event.target as HTMLSelectElement).value;
    this.startDate = `${this.selectedYear}-01-01`;
    this.endDate = `${this.selectedYear}-12-31`;
    const params = new URLSearchParams(window.location.search);
    params.set('startDate', this.startDate);
    params.set('endDate', this.endDate);
    this.history.push(window.location.pathname + '?' + params.toString());
    await this.fetchExpenses();
  }
  private renderChart() {
    const monthlyCategoryExpenses = this.calculateMonthlyCategoryExpenses();
    const months = Object.keys(monthlyCategoryExpenses);
    const datasets = this.categories.map((category, index) => ({
      label: category,
      data: months.map(month => monthlyCategoryExpenses[month][category] || 0),
      backgroundColor: this.generateColor(index),
    }));

    const ctx = this.canvasRef.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.months,
        datasets: datasets,
      },
      options: {
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });
  }

  async componentWillLoad() {
    const params = new URLSearchParams(window.location.search);
    this.startDate = params.get('startDate') || '2024-01-01';
    this.endDate = params.get('endDate') || '2024-12-31';
    this.selectedYear = this.startDate ? this.startDate.split('-')[0] : '';
    await this.fetchExpenses();
  }

  componentDidLoad() {
    this.renderChart();
  }

  private generateColor(index: number) {
    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'];
    return colors[index % colors.length];
  }

  render() {
    return (
      <div>
        <h1>Chart</h1>
        <div>
          <label htmlFor="year-select">Select Year:</label>
          <select id="year-select" onChange={event => this.handleYearChange(event)}>
            {this.years.map(year => (
              <option value={year} selected={Number(this.selectedYear) === year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <canvas style={{ maxWidth: '100%', maxHeight: '400px' }} ref={el => (this.canvasRef = el as HTMLCanvasElement)} id="myChart"></canvas>
      </div>
    );
  }
}
