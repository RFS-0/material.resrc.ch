import {Component, JSX, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../../ripple";
import {composeEventHandlers} from "../../controller";
import {focusController as fc} from '../../focus';
import './styles/filled-icon-button-styles.css';

export type FilledIconButtonProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    icon?: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const FilledIconButton: Component<FilledIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, buttonProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'icon',
    ]);
    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);

    return (
        <button
            use:focusController={{}}
            {...buttonProps}
            {...rippleHandlers}
            onClick={
                composeEventHandlers([
                        buttonProps?.onClick,
                        rippleHandlers.onClick,
                    ]
                )
            }
            onPointerDown={
                composeEventHandlers([
                        buttonProps?.onPointerDown,
                        rippleHandlers.onPointerDown,
                    ]
                )
            }
            class={'shared-icon-button icon-button icon-button--filled'}
            aria-label={props?.ariaLabel || ''}
            aria-haspopup={props?.ariaHasPopup || false}
        >
            <Ripple listen={listen}/>
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
        {componentProps.icon}
      </span>
        </button>
    );
};
