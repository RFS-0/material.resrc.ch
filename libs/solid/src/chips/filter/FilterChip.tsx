import {createSignal, JSX, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';
import './styles/filter-chip-styles.css';
import {createEventDispatcher} from '@solid-primitives/event-dispatcher';
import {focusController as fc} from '../../focus';

export type FilterChipProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string;
    disabled?: boolean;
    disableRipple?: boolean;
    elevated?: boolean;
    icon?: JSX.Element
    label: string;
    onRemoved?: (evt: CustomEvent<void>) => void;
    onSelected?: (evt: CustomEvent<void>) => void;
    removable?: boolean;
    selected?: boolean;
    showFocusRing?: boolean;
} & JSX.HTMLAttributes<HTMLButtonElement>

export const FilterChip = (props: FilterChipProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const dispatch = createEventDispatcher(props);
    const [componentProps, buttonProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'disabled',
        'disableRipple',
        'elevated',
        'icon',
        'label',
        'onRemoved',
        'onSelected',
        'removable',
        'selected',
        'showFocusRing',
    ]);

    let primaryAction: HTMLDivElement | null = null;
    let trailingAction: HTMLDivElement | null = null;

    const [selected, setSelected] = createSignal(componentProps.selected || false);


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

    const handleClick = () => {
        setSelected(!selected());
        if (selected()) {
            dispatch('selected')
        }
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
                disabled: componentProps.disabled
            }}
            class={'chip-shared filter-chip chip-container'}
            classList={{
                'chip-disabled': componentProps.disabled,
                'chip-elevated': componentProps.elevated,
                'chip-selected': selected(),
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
                listen={primaryRippleHandler.listen}
            />
            <button
                {...primaryRippleHandlers}
                {...buttonProps}
                onClick={composeEventHandlers([primaryRippleHandlers.onClick, handleClick])}
                onKeyDown={composeEventHandlers([handleKeyDown])}
                disabled={componentProps.disabled}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='chip-primary chip-action'
                type='button'
                role={'option'}
            >
                <span class={'chip-leading chip-icon'}>
                    <Show when={selected()}
                          fallback={componentProps.icon}
                    >
                        <span class="material-symbols-outlined">check</span>
                    </Show>
                </span>
                <span class="chip-label">{componentProps.label}</span>
                <span class="chip-touch"></span>
            </button>
            <Show when={componentProps.removable}>
                <button
                    use:focusController={{
                        disabled: componentProps.disabled
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
            </Show>
        </div>
    )
}
