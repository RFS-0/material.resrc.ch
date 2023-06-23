import {createSignal, JSX, Show, splitProps} from 'solid-js';
import './styles/shared-button-styles.css';
import './styles/shared-button-elevation-styles.css';
import './styles/elevated-button-styles.css';
import './styles/filled-button-styles.css';
import './styles/outlined-button-styles.css';
import './styles/tonal-button-styles.css';
import './styles/text-button-styles.css';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import {composeEventHandlers} from '../controller';
import {Elevation} from '../elevation';
import {focusController as fc} from '../focus';

export type ButtonProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    label?: string;
    labelElement?: JSX.Element
    leadingIcon?: JSX.Element;
    preventClickDefault?: boolean;
    selected?: boolean;
    showFocusRing?: boolean;
    trailingIcon?: JSX.Element;
    variant: 'filled' | 'outlined' | 'elevated' | 'tonal' | 'text';
} & JSX.HTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, buttonProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'label',
        'labelElement',
        'leadingIcon',
        'preventClickDefault',
        'selected',
        'showFocusRing',
        'trailingIcon',
        'variant'
    ]);

    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    const [selected, setSelected] = createSignal(componentProps?.selected || false);

    const handleClick = (e: MouseEvent) => {
        if (componentProps?.preventClickDefault) {
            e.preventDefault();
        }
        setSelected(!selected());
    };

    return (
        <button
            use:focusController={{
                disabled: !componentProps.showFocusRing,
            }}
            {...buttonProps}
            {...rippleHandlers}
            onClick={
                composeEventHandlers([
                        buttonProps?.onClick,
                        rippleHandlers.onClick,
                        handleClick
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
            class={'button-shared button'}
            classList={{
                'button-elevation-shared': componentProps.variant === 'elevated' || props.variant === 'filled' || props.variant === 'tonal',
                'button--icon-leading': !!componentProps?.leadingIcon,
                'button--icon-trailing': !!componentProps?.trailingIcon,
                'button--elevated': componentProps?.variant === 'elevated',
                'button--filled': componentProps?.variant === 'filled',
                'button--outlined': componentProps?.variant === 'outlined',
                'button--tonal': componentProps?.variant === 'tonal',
                'button--text': componentProps?.variant === 'text',
            }}
            aria-label={props?.ariaLabel || ''}
            aria-haspopup={props?.ariaHasPopup || false}
        >
            <Show when={
                componentProps.variant === 'elevated' || componentProps.variant === 'filled' || componentProps.variant === 'tonal'
            }>
                <Elevation/>
            </Show>
            <Ripple listen={listen} unbounded={true}></Ripple>
            <Show when={componentProps?.variant === 'outlined'}>
                <span class="button__outline"></span>
            </Show>
            <span class="button__touch"></span>
            <Show when={!!componentProps?.leadingIcon}>
                <span class="button__icon-container button__icon--leading">{componentProps.leadingIcon}</span>
            </Show>
            <Show when={!!componentProps?.label}>
                <span class="button__label">{props.label}</span>
            </Show>
            <Show when={!!componentProps?.labelElement}>
                <span class="button__label">{props.labelElement}</span>
            </Show>
            <Show when={!!componentProps?.trailingIcon}>
                <span class="button__icon-container button__icon--trailing">{componentProps.trailingIcon}</span>
            </Show>
        </button>
    );
};
