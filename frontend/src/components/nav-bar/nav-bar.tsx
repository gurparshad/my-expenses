import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'nav-bar',
  styleUrl: 'nav-bar.css',
  shadow: true,
})
export class Navbar {
  @Prop() items: { label: string; url: string }[] = [];

  render() {
    return (
      <div class="navbar">
        <ul class="navbar-items">
          {this.items.map(item => (
            <li>
              <stencil-route-link class="nav-link" url={item.url}>
                {item.label}
              </stencil-route-link>
            </li>
          ))}
        </ul>
        <mode-switcher></mode-switcher>
      </div>
    );
  }
}
