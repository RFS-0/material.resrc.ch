import {Component, JSX, splitProps} from 'solid-js';
import './filled-icon-button-styles.css';
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {composeEventHandlers} from "../controller";
import {focusController as fc} from '../focus';


export type FilledIconButtonProps = {
    icon?: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const FilledIconButton: Component<FilledIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [filledIconButtonProps, buttonProps] = splitProps(props, [
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
            onPointerDown={composeEventHandlers([buttonProps?.onPointerDown, rippleHandlers.onPointerDown])}
            class={'icon-button-shared icon-button icon-button--filled'}
        >
            <Ripple listen={listen} unbounded={true}></Ripple>
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
        {filledIconButtonProps.icon}
      </span>
        </button>
    );
};
