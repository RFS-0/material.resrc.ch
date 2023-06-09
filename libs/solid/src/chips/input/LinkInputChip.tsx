import {JSX, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import {createEventDispatcher} from '@solid-primitives/event-dispatcher';
import './styles/input-chip-styles.css';
import {focusController as fc} from '../../focus';

export type LinkInputChipProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    avatar?: boolean;
    disabled?: boolean;
    disableRipple?: boolean;
    href: string;
    icon?: JSX.Element
    label: string;
    onRemoved?: (evt: CustomEvent<void>) => void;
    removeOnly?: boolean;
    showFocusRing?: boolean;
    target: '_blank' | '_parent' | '_self' | '_top' | '';
} & JSX.HTMLAttributes<HTMLAnchorElement>

export const LinkInputChip = (props: LinkInputChipProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const dispatch = createEventDispatcher(props);
    const [componentProps, linkProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'avatar',
        'disabled',
        'disableRipple',
        'icon',
        'label',
        'onRemoved',
        'removeOnly',
        'showFocusRing',
    ]);

    let primaryAction: HTMLDivElement | null = null;
    let trailingAction: HTMLDivElement | null = null;

    const primaryRippleHandler = createRippleEventEmitter();
    const secondaryRippleHandler = createRippleEventEmitter();
    const primaryRippleHandlers = createHandlers(primaryRippleHandler.emit);
    const trailingRippleHandlers = createHandlers(secondaryRippleHandler.emit);

    const rippleDisabled = () => {
        return componentProps?.disableRipple || false;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        const isLeft = event.key === 'ArrowLeft';
        const isRight = event.key === 'ArrowRight';
        // Ignore non-navigation keys.
        if (!isLeft && !isRight) {
            return;
        }

        if (!primaryAction || !trailingAction) {
            // Does not have multiple actions.
            return;
        }

        // Check if moving forwards or backwards
        const isRtl = getComputedStyle(this).direction === 'rtl';
        const forwards = isRtl ? isLeft : isRight;
        const isPrimaryFocused = primaryAction?.matches(':focus-within');
        const isTrailingFocused = trailingAction?.matches(':focus-within');

        if ((forwards && isTrailingFocused) || (!forwards && isPrimaryFocused)) {
            // Moving outside of the chip, it will be handled by the chip set.
            return;
        }

        // Prevent default interactions, such as scrolling.
        event.preventDefault();
        // Don't let the chip set handle this navigation event.
        event.stopPropagation();
        const actionToFocus = forwards ? trailingAction : primaryAction;
        actionToFocus.focus();
    }

    const handleRemoveClick = (event: Event) => {
        if (componentProps.disabled) {
            return;
        }
        event.stopPropagation();
        dispatch('removed');
    }

    return (
        <div
            use:focusController={{
                disabled: !componentProps.showFocusRing
            }}
            class={'chip-shared input-chip chip-container'}
            classList={{
                'chip-avatar': componentProps.avatar,
                'chip-disabled': componentProps.disabled,
            }}
        >
            <span class="chip-outline"></span>
            <Ripple
                disabled={rippleDisabled()}
                listen={primaryRippleHandler.listen}
            />
            <Show when={!componentProps.removeOnly}
                  fallback={
                      <span
                          class={'chip-primary chip-action'}
                          aria-label={componentProps?.ariaLabel || ''}
                          aria-haspopup={componentProps?.ariaHasPopup || false}
                      >
                          <span class={'chip-leading chip-icon'}>{componentProps.icon}</span>
                          <span class="chip-label">{componentProps.label}</span>
                          <span class="chip-touch"></span>
                      </span>
                  }
            >
                <a
                    {...primaryRippleHandlers}
                    {...linkProps}
                    onKeyDown={handleKeyDown}
                    aria-label={componentProps?.ariaLabel || ''}
                    aria-haspopup={componentProps?.ariaHasPopup || false}
                    class='chip-primary chip-action'
                >
                    <Show when={componentProps.icon}
                          fallback={<span></span>}
                    >
                        <span class="chip-leading chip-icon">{componentProps.icon}</span>
                    </Show>
                    <span class="chip-label">{componentProps.label}</span>
                    <span class="chip-touch"></span>
                </a>
            </Show>
            <button
                use:focusController={{
                    disabled: !componentProps.showFocusRing
                }}
                {...trailingRippleHandlers}
                class="chip-trailing chip-action"
                disabled={componentProps.disabled}
                onClick={handleRemoveClick}
            >
                <Ripple
                    disabled={rippleDisabled()}
                    listen={secondaryRippleHandler.listen}
                />
                <svg class="chip-trailing chip-icon" viewBox="0 96 960 960">
                    <path
                        d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
                </svg>
                <span class="chip-touch"></span>
            </button>
        </div>
    )
}
