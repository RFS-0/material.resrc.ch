import {Component, createSignal, JSX, splitProps} from "solid-js";
import './filled-icon-button-styles.css';
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";
import {FocusRing} from "../focus";

export type StandardIconButtonProps = {
  icon?: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const StandardIconButton: Component<StandardIconButtonProps> = (props) => {
  const [standardIconButtonProps, buttonProps] = splitProps(props, [
    'icon',
  ]);
  const [focus, setFocus] = createSignal(false);
  const {listen, emit} = createRippleEventEmitter();

  const rippleHandlers = createHandlers(emit);

  const activateFocus = () => {
    setFocus(true);
  };

  const deactivateFocus = () => {
    setFocus(false);
  };

  return (
      <button
          {...buttonProps}
          {...rippleHandlers}
          onClick={composeEventHandlers([buttonProps?.onClick, rippleHandlers.onClick])}
          onFocus={composeEventHandlers([buttonProps?.onfocus, activateFocus])}
          onBlur={composeEventHandlers([buttonProps?.onblur, deactivateFocus])}
          onPointerDown={composeEventHandlers([buttonProps?.onPointerDown, deactivateFocus])}
          class={'icon-button-shared icon-button icon-button--standard'}
      >
        <FocusRing visible={focus()}></FocusRing>
        <Ripple
            listen={listen}
            unbounded={true}/>
        <span class="icon-button__touch"></span>
        <span class="icon-button__icon">
        {standardIconButtonProps.icon}
      </span>
      </button>
  );
};
