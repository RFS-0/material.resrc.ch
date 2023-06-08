import { Component, createSignal, JSX, Show, splitProps } from "solid-js";
import './filled-icon-button-styles.css';
import { createHandlers, createRippleEventEmitter, Ripple } from "../ripple";
import { composeEventHandlers } from "../controller";
import { FocusRing } from "../focus";

import './filled-icon-button-styles.css';

export type FilledIconToggleButtonProps = {
  selected?: boolean
  onIcon: JSX.Element
  offIcon: JSX.Element
} & JSX.HTMLAttributes<HTMLButtonElement>

export const FilledIconToggleButton: Component<FilledIconToggleButtonProps> = (props) => {
  const [toggleProps, buttonProps] = splitProps(props, [
    'selected',
    'onIcon',
    'offIcon',
  ]);
  const [focus, setFocus] = createSignal(false);
  const {listen, emit} = createRippleEventEmitter();

  const rippleHandlers = createHandlers(emit);

  const [selected, setSelected] = createSignal(props?.selected || false);

  const activateFocus = () => {
    setFocus(true);
  };

  const deactivateFocus = () => {
    setFocus(false);
  };

  const handleClick = () => {
    setSelected(!selected());
  };

  return (
      <button
          {...buttonProps}
          {...rippleHandlers}
          onClick={composeEventHandlers([buttonProps?.onClick, rippleHandlers.onClick, handleClick])}
          onFocus={composeEventHandlers([buttonProps?.onfocus, activateFocus])}
          onBlur={composeEventHandlers([buttonProps?.onblur, deactivateFocus])}
          onPointerDown={composeEventHandlers([buttonProps?.onPointerDown, deactivateFocus])}
          class={'icon-button-shared icon-button icon-button--filled icon-button--toggle-filled'}
          classList={{
            'icon-button--selected': selected(),
          }}
      >
        <FocusRing visible={focus()}></FocusRing>
        <Ripple listen={listen} unbounded={true}></Ripple>
        <span class="icon-button__touch"></span>
        <span class="icon-button__icon">
        <Show when={selected()}
              fallback={toggleProps.offIcon}
        >
          {toggleProps.onIcon}
        </Show>
      </span>
      </button>
  );
};
