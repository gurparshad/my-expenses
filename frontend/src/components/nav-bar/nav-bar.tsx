import { Component, h } from '@stencil/core';
import '../mode-switcher/mode-switcher';

@Component({
  tag: 'nav-bar',
  styleUrl: 'nav-bar.css',
  shadow: true,
})
export class Navbar {
  render() {
    return (
      <div class="navbar">
        <ul class="navbar-items">
          <li>item 1</li>
          <li>item 2</li>
          <li>item 3</li>
        </ul>
        <mode-switcher></mode-switcher>
      </div>
    );
  }
}
