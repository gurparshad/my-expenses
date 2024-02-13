import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';

@Component({
  tag: 'custom-input',
  styleUrl: 'custom-input.css',
  shadow: true,
})
export class CustomInput {
  @Prop() type: string = 'text';
  @Prop() value: string | number = '';
  @Prop() placeholder: string = '';
  @Event() inputChange: EventEmitter<string>;

  handleInputChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.inputChange.emit(this.value);
  }

  render() {
    return <input type={this.type} value={this.value} placeholder={this.placeholder} onInput={(event: Event) => this.handleInputChange(event)} />;
  }
}
