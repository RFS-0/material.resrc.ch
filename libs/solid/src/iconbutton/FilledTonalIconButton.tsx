import {Component, JSX, splitProps} from "solid-js";
import "./filled-icon-button-styles.css";
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";
import {focusController as fc} from '../focus';

import "./filled-tonal-icon-button-styles.css";

export type FilledTonalIconButtonProps = {
    icon?: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const FilledTonalIconButton: Component<FilledTonalIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [iconProps, buttonProps] = splitProps(props, [
        'icon',
    ]);
    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    return (
        <button
            use:focusController={{}}
            {...buttonProps}
            {...rippleHandlers}
            onClick={composeEventHandlers([buttonProps?.onClick, rippleHandlers.onClick])}
            class={'icon-button-shared tonal-icon-button icon-button'}
        >
            <Ripple listen={listen} unbounded={true}></Ripple>
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
        {iconProps.icon}
      </span>
        </button>
    );
};
