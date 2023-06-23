import {Component, JSX, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../ripple";
import {focusController as fc} from '../focus';

export type OutlinedLinkIconButtonProps = {
    icon?: JSX.Element
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const OutlinedLinkIconButton: Component<OutlinedLinkIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [iconProps, linkProps] = splitProps(props, [
        'icon',
    ]);
    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    return (
        <div
            use:focusController={{}}
            {...rippleHandlers}
            class={`icon-button-shared icon-button icon-button--outlined`}
        >
            <Ripple listen={listen} unbounded={true}></Ripple>
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
        {iconProps.icon}
      </span>
            <a
                {...linkProps}
                class="icon-button__link"
            >
            </a>
        </div>
    );
};
