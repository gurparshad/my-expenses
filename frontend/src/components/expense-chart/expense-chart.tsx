import { Component, Prop, State, h } from '@stencil/core';
import Chart from 'chart.js/auto';
import { ExpenseApi } from '../../api';
import { RouterHistory } from '@stencil-community/router';
import { ExpensesData, Month } from '../../types';
import { Categories, Months, Years } from '../../utils/constants';

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
  @State() expenses: ExpensesData = {
    totalExpenses: 0,
    expenses: [],
  };
  private canvasRef: HTMLCanvasElement;
  private expenseApi: ExpenseApi;
  private chartInstance: Chart;
  private monthlyCategoryExpenses: { [month: string]: { [category: string]: number } } = {}; // Add state to store monthly category expenses

  private async fetchExpenses() {
    try {
      this.expenseApi = new ExpenseApi();
      this.expenses = await this.expenseApi.getExpenses(undefined, undefined, undefined, this.startDate, this.endDate);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  private calculateMonthlyCategoryExpenses() {
    this.monthlyCategoryExpenses = {};
    this.expenses.expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      const category = expense.category;

      if (!this.monthlyCategoryExpenses[month]) {
        this.monthlyCategoryExpenses[month] = {};
      }

      if (!this.monthlyCategoryExpenses[month][category]) {
        this.monthlyCategoryExpenses[month][category] = 0;
      }

      this.monthlyCategoryExpenses[month][category] += expense.amount;
    });
  }

  private renderChart() {
    const months = Object.keys(this.monthlyCategoryExpenses);
    const monthLabels = Months.map((month: Month) => month.label);
    const datasets = Categories.map((category, index) => ({
      label: category,
      data: months.map(month => this.monthlyCategoryExpenses[month][category] || 0),
      backgroundColor: this.generateColor(index),
    }));

    if (this.chartInstance) {
      this.chartInstance.data.labels = Months;
      this.chartInstance.data.datasets = datasets;
      this.chartInstance.update();
    } else {
      const ctx = this.canvasRef.getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: monthLabels,
          datasets: datasets,
        },
        options: {
          scales: {
            x: {
              stacked: true,
              grid: {
                display: false,
              },
              ticks: {
                color: '#B4D1D5',
              },
            },
            y: {
              stacked: true,
              grid: {
                display: false,
              },
              ticks: {
                color: '#B4D1D5',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#B4D1D5', // Change the color of the legend labels
              },
            },
          },
        },
      });
    }
  }

  private async handleYearChange(event: Event) {
    this.selectedYear = (event.target as HTMLSelectElement).value;
    this.startDate = `${this.selectedYear}-01-01`;
    this.endDate = `${this.selectedYear}-12-31`;
    const params = new URLSearchParams(window.location.search);
    params.set('startDate', this.startDate);
    params.set('endDate', this.endDate);
    this.history.push(window.location.pathname + '?' + params.toString());
    await this.fetchExpenses();
    this.calculateMonthlyCategoryExpenses();
    this.renderChart();
  }

  async componentWillLoad() {
    const params = new URLSearchParams(window.location.search);
    this.startDate = params.get('startDate') || '2024-01-01';
    this.endDate = params.get('endDate') || '2024-12-31';
    this.selectedYear = this.startDate ? this.startDate.split('-')[0] : '';
    await this.fetchExpenses();
    this.calculateMonthlyCategoryExpenses();
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
          <label htmlFor="year-select">Year:</label>
          <select id="year-select" onChange={event => this.handleYearChange(event)}>
            {Years.map(year => (
              <option value={year} selected={this.selectedYear === year}>
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
