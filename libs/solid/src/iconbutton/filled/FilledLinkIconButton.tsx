import {Component, JSX, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../../ripple";
import {focusController as fc} from '../../focus';
import './styles/filled-icon-button-styles.css';

export type FilledLinkIconButtonProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    icon: JSX.Element
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const FilledLinkIconButton: Component<FilledLinkIconButtonProps> = (props) => {
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
            class={'shared-icon-button icon-button icon-button--filled'}
        >
            <Ripple listen={listen}></Ripple>
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
