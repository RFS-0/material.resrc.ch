import './styles/switch-styles.css';
import {JSX, createSignal, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import {focusController as fc} from '../focus';
import {composeEventHandlers} from '../controller';

export type SwitchProps = {
    ariaLabel?: string
    disabled?: boolean
    icons?: boolean
    selected?: boolean
    showOnlySelectedIcon?: boolean
    showFocusRing?: boolean
} & JSX.HTMLAttributes<HTMLButtonElement>

export const Switch = (props: SwitchProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, switchProps] = splitProps(props, [
        'ariaLabel',
        'disabled',
        'icons',
        'selected',
        'showOnlySelectedIcon',
        'showFocusRing'
    ]);

    let switchRef: HTMLButtonElement | null = null;

    const [selected, setSelected] = createSignal(props.selected || false)

    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);

    const handleClick = () => {
        if (componentProps?.disabled) {
            return;
        }
        setSelected(!selected())
        switchRef.dispatchEvent(new InputEvent('input', {bubbles: true, composed: true}));
        // Bubbles but does not compose to mimic native browser <input> & <select>
        // Additionally, native change event is not an InputEvent.
        switchRef.dispatchEvent(new Event('change', {bubbles: true}));
    }

    const shouldShowIcons = () => {
        return props?.icons || props?.showOnlySelectedIcon;
    }

    return (
        <button
            {...switchProps}
            {...rippleHandlers}
            ref={switchRef}
            type={'button'}
            class={'switch-shared switch'}
            classList={{
                'switch--selected': selected(),
                'switch--unselected': !selected(),
            }}
            role={'switch'}
            aria-checked={componentProps?.selected}
            aria-label={componentProps?.ariaLabel || undefined}
            use:focusController={{
                disabled: componentProps.disabled || !componentProps.showFocusRing,
            }}
            disabled={componentProps?.disabled}
            onClick={
                composeEventHandlers([
                        switchProps?.onClick,
                        rippleHandlers.onClick,
                        handleClick
                    ]
                )
            }
        >
            <span class="switch__track">
                <span
                    {...rippleHandlers}
                    class="switch__handle-container"
                >
                    <Ripple listen={listen} disabled={componentProps.disabled}/>
                    <span
                        class={'switch__handle'}
                        classList={{
                            'with-icon': componentProps.icons || (componentProps.showOnlySelectedIcon && componentProps.selected),
                        }}
                    >
                        <Show when={shouldShowIcons()}>
                            <div class="switch__icons">
                                <svg class="switch__icon switch__icon--on" viewBox="0 0 24 24">
                                    <path d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z"/>
                                </svg>
                                <Show when={!props?.showOnlySelectedIcon}>
                                    <svg class="switch__icon icon--off" viewBox="0 0 24 24">
                                        <path
                                            d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z"/>
                                    </svg>
                                </Show>
                            </div>
                        </Show>
                    </span>
                    <span class="switch__touch"></span>
                </span>
            </span>
        </button>
    )
}
