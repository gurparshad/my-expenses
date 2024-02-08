import { Component, h } from '@stencil/core';
import Chart from 'chart.js/auto'; // Import Chart.js library

@Component({
  tag: 'expense-chart',
  styleUrl: 'expense-chart.css',
  shadow: true,
})
export class ExpenseChart {
  private canvasRef: HTMLCanvasElement;

  componentDidLoad() {
    this.renderChart();
  }

  private renderChart() {
    const ctx = this.canvasRef.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
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
        <canvas ref={el => (this.canvasRef = el as HTMLCanvasElement)} id="myChart"></canvas>
      </div>
    );
  }
}
