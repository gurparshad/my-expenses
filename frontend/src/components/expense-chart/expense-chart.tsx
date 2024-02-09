import { Component, State, h } from '@stencil/core';
import Chart from 'chart.js/auto'; // Import Chart.js library
import { ExpenseApi } from '../../api';

@Component({
  tag: 'expense-chart',
  styleUrl: 'expense-chart.css',
  shadow: true,
})
export class ExpenseChart {
  @State() selectedYear: number;
  private canvasRef: HTMLCanvasElement;
  private expenseApi: ExpenseApi;
  private expenses: any[];

  private async fetchExpenses() {
    try {
      this.expenseApi = new ExpenseApi();
      this.expenses = await this.expenseApi.getExpenses();
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  private calculateMonthlyExpenses() {
    const monthlyExpenses: { [month: string]: number } = {};

    this.expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();

      if (!monthlyExpenses[month]) {
        monthlyExpenses[month] = 0;
      }

      monthlyExpenses[month] += expense.amount;
    });

    console.log('monthlyExpenses-->>', monthlyExpenses);

    const totalExpensesPerMonth: number[] = [];

    for (let i = 0; i < 12; i++) {
      if (monthlyExpenses[i] !== undefined) {
        totalExpensesPerMonth.push(monthlyExpenses[i]);
      } else {
        totalExpensesPerMonth.push(0);
      }
    }

    return totalExpensesPerMonth;
  }

  handleYearChange(event: Event) {
    this.selectedYear = parseInt((event.target as HTMLSelectElement).value, 10);
    this.fetchExpenses();
  }

  async componentWillLoad() {
    await this.fetchExpenses();
  }

  componentDidLoad() {
    this.renderChart();
  }

  // TODO: Have to add year selection as well.
  // Expenses need pagination

  private renderChart() {
    const ctx = this.canvasRef.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Monthly Expenses',
            data: this.calculateMonthlyExpenses(),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  render() {
    return (
      <div>
        <h1>Chart</h1>
        <div>
          {/* Year filter dropdown */}
          <select onChange={this.handleYearChange.bind(this)}>
            <option value="">Select Year</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            {/* Add more years as needed */}
          </select>
        </div>
        <canvas style={{ maxWidth: '100%', maxHeight: '400px' }} ref={el => (this.canvasRef = el as HTMLCanvasElement)} id="myChart"></canvas>
      </div>
    );
  }
}
