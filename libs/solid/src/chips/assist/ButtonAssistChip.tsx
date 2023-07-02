import {JSX, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import './styles/assist-chip-styles.css';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';
import {focusController as fc} from '../../focus';

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
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
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

    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    const rippleDisabled = () => {
        return componentProps?.disableRipple || false;
    }

    return (
        <div
            use:focusController={{
                disabled: !componentProps.showFocusRing,
            }}
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
            <Ripple
                disabled={rippleDisabled()}
                listen={listen}
            />
            <button
                {...rippleHandlers}
                {...buttonProps}
                onPointerDown={composeEventHandlers([
                    buttonProps?.onPointerDown,
                    rippleHandlers.onPointerDown,
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

