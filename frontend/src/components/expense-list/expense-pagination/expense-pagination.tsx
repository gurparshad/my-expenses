import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'expense-pagination',
  styleUrl: 'expense-pagination.css',
  shadow: true,
})
export class ExpensePagination {
  @Prop() currentPage: number;
  @Prop() totalPages: number;
  @Event() nextPage: EventEmitter<void>;
  @Event() prevPage: EventEmitter<void>;

  render() {
    return (
      <div class="pagination">
        <custom-button color="secondary" onClick={() => this.prevPage.emit()} disabled={this.currentPage === 1}>
          Previous
        </custom-button>
        <span>
          Page {this.currentPage} of {this.totalPages}
        </span>
        <custom-button color="secondary" onClick={() => this.nextPage.emit()} disabled={this.currentPage === this.totalPages}>
          Next
        </custom-button>
      </div>
    );
  }
}
