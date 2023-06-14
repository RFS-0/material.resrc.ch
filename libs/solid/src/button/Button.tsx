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
import {FocusRing} from '../focus';
import {Elevation} from '../elevation';

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
    const [variantProps, buttonProps] = splitProps(props, [
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

    const [focus, setFocus] = createSignal(variantProps.showFocusRing || false);
    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    const [selected, setSelected] = createSignal(variantProps?.selected || false);

    const activateFocus = () => {
        if (!variantProps?.showFocusRing) {
            return;
        }
        setFocus(true);
    };

    const deactivateFocus = () => {
        if (!variantProps?.showFocusRing) {
            return;
        }
        setFocus(false);
    };

    const handleClick = (e: MouseEvent) => {
        if (variantProps?.preventClickDefault) {
            e.preventDefault();
        }
        setSelected(!selected());
    };

    return (
        <button
            {...buttonProps}
            {...rippleHandlers}
            onClick={composeEventHandlers([
                buttonProps?.onClick,
                rippleHandlers.onClick,
                handleClick])
            }
            onFocus={composeEventHandlers([buttonProps?.onfocus, activateFocus])}
            onBlur={composeEventHandlers([buttonProps?.onblur, deactivateFocus])}
            onPointerDown={composeEventHandlers([
                buttonProps?.onPointerDown,
                rippleHandlers.onPointerDown,
                deactivateFocus
            ])}
            class={'button-shared button'}
            classList={{
                'button-elevation-shared': variantProps.variant === 'elevated' || props.variant === 'filled' || props.variant === 'tonal',
                'button--icon-leading': !!variantProps?.leadingIcon,
                'button--icon-trailing': !!variantProps?.trailingIcon,
                'button--elevated': variantProps?.variant === 'elevated',
                'button--filled': variantProps?.variant === 'filled',
                'button--outlined': variantProps?.variant === 'outlined',
                'button--tonal': variantProps?.variant === 'tonal',
                'button--text': variantProps?.variant === 'text',
            }}
            aria-label={props?.ariaLabel || ''}
            aria-haspopup={props?.ariaHasPopup || false}
        >
            <FocusRing visible={focus()}></FocusRing>
            <Show when={
                variantProps.variant === 'elevated' || variantProps.variant === 'filled' || variantProps.variant === 'tonal'
            }>
                <Elevation/>
            </Show>
            <Ripple listen={listen} unbounded={true}></Ripple>
            <Show when={variantProps?.variant === 'outlined'}>
                <span class="button__outline"></span>
            </Show>
            <span class="button__touch"></span>
            <Show when={!!variantProps?.leadingIcon}>
                <span class="button__icon-container button__icon--leading">{variantProps.leadingIcon}</span>
            </Show>
            <Show when={!!variantProps?.label}>
                <span class="button__label">{props.label}</span>
            </Show>
            <Show when={!!variantProps?.labelElement}>
                <span class="button__label">{props.labelElement}</span>
            </Show>
            <Show when={!!variantProps?.trailingIcon}>
                <span class="button__icon-container button__icon--trailing">{variantProps.trailingIcon}</span>
            </Show>
        </button>
    );
};
