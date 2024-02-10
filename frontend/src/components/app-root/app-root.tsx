import { Component, h } from '@stencil/core';
import '../nav-bar/nav-bar';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  render() {
    return (
      <div>
        <header>
          <nav-bar></nav-bar>
        </header>
        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url="/" component="app-home" exact={true} />
              <stencil-route url="/create" component="create-expense" />
              <stencil-route url="/details/:expenseId" component="expense-details-two" />
              <stencil-route url="/edit/:expenseId" component="expense-edit" />
              <stencil-route url="/chart" component="expense-chart" />
            </stencil-route-switch>
          </stencil-router>
        </main>
      </div>
    );
  }
}
