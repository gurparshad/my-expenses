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

  private async fetchExpenses() {
    try {
      this.expenseApi = new ExpenseApi();
      this.expenses = await this.expenseApi.getExpenses();
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

  private generateColor(index: number) {
    // Generate a random color based on index
    // You can use a different method to generate colors if needed
    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'];
    return colors[index % colors.length];
  }

  // TODO: Have to add year selection as well.

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
