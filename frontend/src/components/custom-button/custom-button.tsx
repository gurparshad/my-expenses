import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import classNames from 'classnames';

@Component({
  tag: 'custom-button',
  styleUrl: 'custom-button.css',
  shadow: true,
})
export class CustomButton {
  @Prop() disabled: boolean;
  @Prop() color: 'danger' | 'secondary';
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';
  @Event() buttonClick: EventEmitter<void>;

  handleClick() {
    this.buttonClick.emit();
  }

  render() {
    const buttonClasses = classNames('custom-button', {
      secondary: this.color === 'secondary',
      danger: this.color === 'danger',
    });
    return (
      <button class={buttonClasses} onClick={this.handleClick} disabled={this.disabled} type={this.type}>
        <slot></slot>
      </button>
    );
  }
}
