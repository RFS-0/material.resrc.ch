import {Component, JSX, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../../ripple";
import {composeEventHandlers} from "../../controller";
import {focusController as fc} from '../../focus';
import './styles/filled-tonal-icon-button-styles.css';

export type FilledTonalIconButtonProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    icon?: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const FilledTonalIconButton: Component<FilledTonalIconButtonProps> = (props) => {
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
            class={'shared-icon-button icon-button icon-button--filled-tonal'}
            aria-label={props?.ariaLabel || ''}
            aria-haspopup={props?.ariaHasPopup || false}
        >
            <Ripple listen={listen} unbounded={true}/>
            <span class="icon-button__touch"></span>
            <span class="icon-button__icon">
        {componentProps.icon}
      </span>
        </button>
    );
};
