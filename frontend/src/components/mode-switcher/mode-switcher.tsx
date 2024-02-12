import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'mode-switcher',
  styleUrl: 'mode-switcher.css',
  shadow: true,
})
export class ModeSwitcher {
  @State() darkMode: boolean = false;

  componentWillLoad() {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode !== null) {
      this.darkMode = storedMode === 'true';
      document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    }
  }

  toggleMode() {
    this.darkMode = !this.darkMode;
    document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  render() {
    return (
      <div onClick={() => this.toggleMode()}>
        {this.darkMode ? <img src="assets/icon/sun-solid.svg" alt="light" class="mode-icon" /> : <img src="assets/icon/moon-solid.svg" alt="dark" class="mode-icon" />}
      </div>
    );
  }
}
