import {Component, createSignal, JSX, Show, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";

export type FilledTonalIconToggleButtonProps = {
  selected?: boolean
  onIcon: JSX.Element
  offIcon: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const FilledTonalIconToggleButton: Component<FilledTonalIconToggleButtonProps> = (props) => {
  const [filledTonalIconToggleButtonProps, buttonProps] = splitProps(props, [
    'selected',
    'onIcon',
    'offIcon',
  ]);
  const {listen, emit} = createRippleEventEmitter();

  const rippleHandlers = createHandlers(emit);

  const [selected, setSelected] = createSignal(props?.selected || false);


  const handleClick = () => {
    setSelected(!selected());
  };

  return (
      <button
          use:focusController={{}}
          {...buttonProps}
          {...rippleHandlers}
          onClick={composeEventHandlers([buttonProps?.onClick, rippleHandlers.onClick, handleClick])}
          class={'icon-button-shared tonal-icon-button icon-button icon-button--toggle-filled-tonal'}
          classList={{
            'icon-button--selected': selected(),
          }}
      >
        <Ripple listen={listen} unbounded={true}></Ripple>
        <span class="icon-button__touch"></span>
        <span class="icon-button__icon">
        <Show when={selected()}
              fallback={filledTonalIconToggleButtonProps.offIcon}
        >
          {filledTonalIconToggleButtonProps.onIcon}
        </Show>
      </span>
      </button>
  );
};
