import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'mode-switcher',
  styleUrl: 'mode-switcher.css',
  shadow: true,
})
export class ModeSwitcher {
  @State() darkMode: boolean = false;

  toggleMode() {
    this.darkMode = !this.darkMode;
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
  }

  render() {
    return (
      <div class={this.darkMode ? 'dark-mode' : 'light-mode'}>
        <label>
          <input type="checkbox" checked={this.darkMode} onChange={() => this.toggleMode()} />
          Dark Mode
        </label>
      </div>
    );
  }
}
