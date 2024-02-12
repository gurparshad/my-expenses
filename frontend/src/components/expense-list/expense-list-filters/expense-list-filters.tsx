import { Component, Prop, h } from '@stencil/core';
import { Categories, Months, Years } from '../../../utils/constants';

@Component({
  tag: 'expense-list-filters',
  styleUrl: 'expense-list-filters.css',
  shadow: true,
})
export class ExpenseListFilters {
  @Prop() selectedCategory: string;
  @Prop() selectedMonth: string;
  @Prop() selectedYear: string;
  @Prop() handleCategorySelect: (event: Event) => void;
  @Prop() handleMonthChange: (event: Event) => void;
  @Prop() handleYearChange: (event: Event) => void;

  componentWillLoad() {}

  render() {
    return (
      <div class="filter">
        <label htmlFor="category-select">Category:</label>
        <select id="category-select" onChange={event => this.handleCategorySelect(event)}>
          <option value="">All</option>
          {Categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <label htmlFor="month-select">Month:</label>
        <select id="month-select" onChange={event => this.handleMonthChange(event)}>
          <option value="">All</option>
          {Months.map(month => (
            <option value={month.value} selected={this.selectedMonth === month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <label htmlFor="year-select">Year:</label>
        <select id="year-select" onChange={event => this.handleYearChange(event)}>
          {Years.map(year => (
            <option value={year} selected={this.selectedYear === year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    );
  }
}