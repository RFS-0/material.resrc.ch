import {Component, createSignal, JSX, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";
import {FocusRing} from "../focus";
import './filled-tonal-icon-button-styles.css';
import './filled-icon-button-styles.css';

export type FilledTonalLinkIconButtonProps = {
  icon: JSX.Element
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const FilledTonalLinkIconButton: Component<FilledTonalLinkIconButtonProps> = (props) => {
  const [iconButtonProps, linkProps] = splitProps(props, [
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
      <div
          {...rippleHandlers}
          onFocus={composeEventHandlers([linkProps?.onfocus, activateFocus])}
          onBlur={composeEventHandlers([linkProps?.onblur, deactivateFocus])}
          onPointerDown={composeEventHandlers([linkProps?.onPointerDown, deactivateFocus])}
          class={`icon-button-shared tonal-icon-button icon-button icon-button--filled-tonal`}
      >
        <FocusRing visible={focus()}></FocusRing>
        <Ripple listen={listen} unbounded={true}></Ripple>
        <span class="icon-button__touch"></span>
        <span class="icon-button__icon">
        {iconButtonProps.icon}
      </span>
        <a
            {...linkProps}
            class="icon-button__link"
        >
        </a>
      </div>
  );
};
