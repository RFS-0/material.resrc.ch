import {Component, createSignal, JSX, Show, splitProps} from "solid-js";
import './filled-icon-button-styles.css';
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";
import {focusController as fc} from '../focus';

import './standard-icon-button-styles.css';

export type OutlinedIconToggleButtonProps = {
    selected?: boolean
    onIcon?: JSX.Element
    offIcon?: JSX.Element
} & JSX.HTMLAttributes<HTMLButtonElement>

export const OutlinedIconToggleButton: Component<OutlinedIconToggleButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [toggleProps, buttonProps] = splitProps(props, [
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
            class={`icon-button-shared icon-button icon-button--outlined`}
            classList={{
                'icon-button--selected': selected(),
            }}
        >
            <Ripple listen={listen} unbounded={true}></Ripple>
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
        <Show when={selected()}
              fallback={toggleProps.offIcon}>
          {toggleProps.onIcon}
        </Show>
      </span>
        </button>
    );
};
