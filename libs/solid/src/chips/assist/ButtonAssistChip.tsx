import {createSignal, JSX, Show, splitProps} from 'solid-js';
import {FocusRing} from '../../focus';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import './styles/assist-chip-styles.css';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';

export type ButtonAssistChipProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    disabled?: boolean;
    disableRipple?: boolean;
    elevated?: boolean;
    icon?: JSX.Element
    label: string;
    showFocusRing?: boolean;
} & JSX.HTMLAttributes<HTMLButtonElement>

export const ButtonAssistChip = (props: ButtonAssistChipProps) => {
    const [componentProps, buttonProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'disabled',
        'disableRipple',
        'elevated',
        'icon',
        'label',
        'showFocusRing',
    ]);

    const [focus, setFocus] = createSignal(componentProps?.showFocusRing || false);
    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    const rippleDisabled = () => {
        return componentProps?.disableRipple || false;
    }

    const activateFocus = () => {
        if (!componentProps?.showFocusRing) {
            return;
        }
        setFocus(true);
    };

    const deactivateFocus = () => {
        if (!componentProps?.showFocusRing) {
            return;
        }
        setFocus(false);
    };

    return (
        <div
            class={'chip-shared suggestion-chip chip-container'}
            classList={{
                'chip-disabled': componentProps.disabled,
                'chip-elevated': componentProps.elevated
            }}
        >
            <Show
                when={componentProps.elevated}
                fallback={
                    <span class="chip-outline"></span>
                }
            >
                <Elevation/>
            </Show>
            <FocusRing visible={focus()}></FocusRing>
            <Ripple
                disabled={rippleDisabled()}
                listen={listen}
                unbounded={true}
            />
            <button
                {...rippleHandlers}
                {...buttonProps}
                onFocus={composeEventHandlers([buttonProps?.onfocus, activateFocus])}
                onBlur={composeEventHandlers([buttonProps?.onblur, deactivateFocus])}
                onPointerDown={composeEventHandlers([
                    buttonProps?.onPointerDown,
                    rippleHandlers.onPointerDown,
                    deactivateFocus
                ])}
                disabled={componentProps.disabled}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='chip-primary chip-action'
                type='button'
            >
                <Show when={componentProps.icon}
                      fallback={<span></span>}
                >
                    <span class="chip-leading chip-icon">{componentProps.icon}</span>
                </Show>
                <span class="chip-label">{componentProps.label}</span>
                <span class="chip-touch"></span>
            </button>
        </div>
    )
}

