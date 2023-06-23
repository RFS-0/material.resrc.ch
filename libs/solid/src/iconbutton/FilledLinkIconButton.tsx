import {Component, JSX, splitProps} from "solid-js";
import "./filled-icon-button-styles.css";
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {focusController as fc} from '../focus';

export type FilledLinkIconButtonProps = {
    icon: JSX.Element
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const FilledLinkIconButton: Component<FilledLinkIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [iconButtonProps, linkProps] = splitProps(props, [
        'icon',
    ]);
    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    return (
        <div
            use:focusController={{}}
            {...rippleHandlers}
            class={`icon-button-shared icon-button icon-button--filled`}
        >
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
