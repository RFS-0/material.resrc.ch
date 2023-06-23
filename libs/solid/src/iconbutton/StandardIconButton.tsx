import {Component, JSX, splitProps} from "solid-js";
import './filled-icon-button-styles.css';
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";
import {focusController as fc} from '../focus';

export type StandardIconButtonProps = {
    icon?: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const StandardIconButton: Component<StandardIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [standardIconButtonProps, buttonProps] = splitProps(props, [
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
            class={'icon-button-shared icon-button icon-button--standard'}
        >
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
