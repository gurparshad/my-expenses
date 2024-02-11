import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import classNames from 'classnames';

@Component({
  tag: 'custom-button',
  styleUrl: 'custom-button.css',
  shadow: true,
})
export class CustomButton {
  @Prop() disabled: boolean;
  @Event() buttonClick: EventEmitter<void>;
  @Prop() color: 'danger' | 'success' | 'secondary';

  handleClick() {
    this.buttonClick.emit();
  }

  render() {
    const buttonClasses = classNames('cus-button', {
      secondary: this.color === 'secondary',
      danger: this.color === 'danger',
      success: this.color === 'success',
    });
    return (
      <button class={buttonClasses} onClick={this.handleClick} disabled={this.disabled}>
        <slot></slot>
      </button>
    );
  }
}
