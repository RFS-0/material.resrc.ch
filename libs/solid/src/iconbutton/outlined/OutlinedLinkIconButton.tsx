import {Component, JSX, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../../ripple";
import {focusController as fc} from '../../focus';
import './styles/outlined-icon-button-styles.css';

export type OutlinedLinkIconButtonProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    icon: JSX.Element
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const OutlinedLinkIconButton: Component<OutlinedLinkIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, linkProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'icon',
    ]);
    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);


    return (
        <div
            use:focusController={{}}
            {...rippleHandlers}
            class={'shared-icon-button icon-button icon-button--outlined'}
        >
            <Ripple listen={listen} ></Ripple>
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
          {componentProps.icon}
      </span>
            <a
                {...linkProps}
                class="icon-button__link"
            >
            </a>
        </div>
    );
};
