import { Component, h } from '@stencil/core';
import '../nav-bar/nav-bar';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  render() {
    const navbarItems = [
      { label: 'Home', url: '/' },
      { label: 'Create Expense', url: '/create' },
      { label: 'Chart', url: '/chart' },
    ];
    return (
      <div>
        <header>
          <nav-bar items={navbarItems}></nav-bar>
        </header>
        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url="/" component="app-home" exact={true} />
              <stencil-route url="/create" component="create-expense" />
              <stencil-route url="/details/:expenseId" component="expense-details" />
              <stencil-route url="/edit/:expenseId" component="expense-edit" />
              <stencil-route url="/chart" component="expense-chart" />
            </stencil-route-switch>
          </stencil-router>
        </main>
      </div>
    );
  }
}
