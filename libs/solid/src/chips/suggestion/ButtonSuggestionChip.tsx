import {JSX, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import './styles/suggestion-chip-styles.css';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';
import {focusController as fc} from '../../focus';

export type ButtonSuggestionChipProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    disabled?: boolean;
    disableRipple?: boolean;
    elevated?: boolean;
    label: string;
    showFocusRing?: boolean;
} & JSX.HTMLAttributes<HTMLButtonElement>

export const ButtonSuggestionChip = (props: ButtonSuggestionChipProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, buttonProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'disabled',
        'disableRipple',
        'elevated',
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
            {...rippleHandlers}
            onClick={composeEventHandlers([buttonProps?.onClick, rippleHandlers.onClick])}
            class={'chip-shared suggestion-chip chip-container'}
            classList={{
                'disabled': componentProps.disabled,
                'elevated': componentProps.elevated
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
                unbounded={true}
            />
            <button
                {...buttonProps}
                disabled={componentProps.disabled}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='chip-primary chip-action'
                type='button'
            >
                <span class="chip-label">{componentProps.label}</span>
                <span class="chip-touch"></span>
            </button>
        </div>
    )
}
