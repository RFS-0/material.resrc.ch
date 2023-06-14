import {createSignal, JSX, Show, splitProps} from 'solid-js';
import {FocusRing} from '../focus';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import './styles/assist-chip-styles.css';
import {composeEventHandlers} from '../controller';
import {Elevation} from '../elevation';

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
            {...rippleHandlers}
            onClick={composeEventHandlers([buttonProps?.onClick, rippleHandlers.onClick])}
            onFocus={composeEventHandlers([buttonProps?.onfocus, activateFocus])}
            onBlur={composeEventHandlers([buttonProps?.onblur, deactivateFocus])}
            onPointerDown={composeEventHandlers([buttonProps?.onPointerDown, deactivateFocus])}
            class={'chip-shared assist-chip container'}
            classList={{
                'disabled': componentProps.disabled,
                'elevated': componentProps.elevated
            }}
        >
            <Show
                when={componentProps.elevated}
                fallback={
                    <span class="outline"></span>
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
                {...buttonProps}
                disabled={componentProps.disabled}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='primary action'
                type='button'
            >
                <Show when={componentProps.icon}>
                    <span class="leading icon">{componentProps.icon}</span>
                </Show>
                <span class="label">{componentProps.label}</span>
                <span class="touch"></span>
            </button>
        </div>
    )
}

