import {Component, JSX, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";
import {focusController as fc} from '../focus';

export type OutlinedIconButtonProps = {
    icon: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const OutlinedIconButton: Component<OutlinedIconButtonProps> = (props) => {
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
            class={'icon-button-shared icon-button icon-button--outlined'}
        >
            <Ripple
                listen={listen}
                unbounded={true}
            />
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
        {props?.children} {iconProps.icon}
      </span>
        </button>
    );
};
