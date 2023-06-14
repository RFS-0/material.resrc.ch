import {createSignal, JSX, onMount, Show, splitProps} from 'solid-js';
import {FocusRing} from '../../focus';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';
import './styles/filter-chip-styles.css';
import {createEventDispatcher} from '@solid-primitives/event-dispatcher';

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

    const [focus, setFocus] = createSignal(componentProps?.showFocusRing || false);

    const primaryRippleHandler = createRippleEventEmitter();
    const secondaryRippleHandler = createRippleEventEmitter();
    const primaryRippleHandlers = createHandlers(primaryRippleHandler.emit);
    const trailingRippleHandlers = createHandlers(secondaryRippleHandler.emit);

    const rippleDisabled = () => {
        return componentProps?.disableRipple || false;
    }


    const updateTabIndices = () => {
        if (!primaryAction || !trailingAction) {
            // Does not have multiple actions.
            primaryAction?.removeAttribute('tabindex');
            trailingAction?.removeAttribute('tabindex');
            return;
        }

        if (trailingAction.matches(':focus-within')) {
            trailingAction.removeAttribute('tabindex');
            primaryAction.tabIndex = -1;
            return;
        }

        primaryAction.removeAttribute('tabindex');
        trailingAction.tabIndex = -1;
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
        updateTabIndices();
    }

    const handleClick = () => {
        setSelected(!selected());
        if (selected()) {
            dispatch('selected')
        }
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

    const handleFocus = (e: FocusEvent) => {
        activateFocus();
        if (e.target === trailingAction) {
            trailingAction.focus()
        }
    }

    const handleRemoveClick = (event: Event) => {
        if (componentProps.disabled) {
            return;
        }
        event.stopPropagation();
        dispatch('removed');
    }

    onMount(() => {
        updateTabIndices();
    })

    return (
        <div
            class={'chip-shared filter-chip container'}
            classList={{
                'disabled': componentProps.disabled,
                'elevated': componentProps.elevated,
                'selected': selected(),
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
                listen={primaryRippleHandler.listen}
                unbounded={true}
            />
            <button
                {...primaryRippleHandlers}
                {...buttonProps}
                onClick={composeEventHandlers([primaryRippleHandlers.onClick, handleClick])}
                onFocusIn={composeEventHandlers([updateTabIndices])}
                onFocus={composeEventHandlers([handleFocus])}
                onFocusOut={composeEventHandlers([updateTabIndices])}
                onBlur={composeEventHandlers([deactivateFocus])}
                onPointerDown={composeEventHandlers([primaryRippleHandlers.onPointerDown, deactivateFocus])}
                onKeyDown={composeEventHandlers([handleKeyDown])}
                disabled={componentProps.disabled}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='primary action'
                type='button'
                role={'option'}
            >
                <span class={'leading icon'}>
                    <Show when={selected()}
                          fallback={componentProps.icon}
                    >
                        <span class="material-symbols-outlined">check</span>
                    </Show>
                </span>
                <span class="label">{componentProps.label}</span>
                <span class="touch"></span>
            </button>
            <Show when={componentProps.removable}>
                <button
                    {...trailingRippleHandlers}
                    class="trailing action"
                    disabled={componentProps.disabled}
                    onClick={handleRemoveClick}
                >
                    <FocusRing visible={focus()}></FocusRing>
                    <Ripple
                        disabled={rippleDisabled()}
                        listen={secondaryRippleHandler.listen}
                        unbounded={true}
                    />
                    <svg class="trailing icon" viewBox="0 96 960 960">
                        <path
                            d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
                    </svg>
                    <span class="touch"></span>
                </button>
            </Show>
        </div>
    )
}

