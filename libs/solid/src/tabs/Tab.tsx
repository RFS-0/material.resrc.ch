import {Component, createEffect, createMemo, JSX, onMount, splitProps} from 'solid-js';
import './styles/tab-styles.css'
import {focusController as fc} from '../focus';
import {Elevation} from '../elevation';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import {SetStoreFunction, Store} from 'solid-js/store';
import {addTab, TabItemData,  Variant} from './shared';
import {createEventDispatcher} from '@solid-primitives/event-dispatcher';

export type TabProps = {
    id: string;
    ariaLabel?: string;
    disabled?: boolean;
    focusable?: boolean;
    icon?: JSX.Element;
    inlineIcon?: boolean;
    label?: string;
    onSelected?: (evt: CustomEvent<TabItemData>) => void;
    onDeselected?: (evt: CustomEvent<TabItemData>) => void;
    selected: boolean;
    showFocusRing?: boolean;
    tabStore: [get: Store<TabItemData[]>, set: SetStoreFunction<TabItemData[]>];
    variant?: Variant;
} & JSX.HTMLAttributes<HTMLDivElement>

function shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const Tab: Component<TabProps> = (props) => {
    //noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const dispatch = createEventDispatcher(props);
    const [componentProps, tabProps] = splitProps(props, [
        'ariaLabel',
        'disabled',
        'focusable',
        'icon',
        'id',
        'inlineIcon',
        'label',
        'selected',
        'showFocusRing',
        'tabStore',
        'variant'
    ]);

    const tabs = componentProps.tabStore[0];
    const variant = createMemo(() => componentProps.variant || 'primary');
    const inlineIcon = createMemo(() => componentProps.inlineIcon || false);

    let buttonElement: HTMLButtonElement | null = null;
    let indicatorElement: HTMLDivElement | null = null;

    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);

    const item = createMemo(
        () => tabs.find((item: TabItemData) => item.id === props.id)
    );

    onMount(() => {
        addTab(
            {
                id: componentProps.id,
                indicator: createMemo(() => indicatorElement),
                disabled: componentProps.disabled,
                focusable: componentProps.focusable,
                selected: componentProps.selected,
                previouslySelected: false,
            },
            componentProps.tabStore
        );

        createEffect(() => {
            if (item()?.selected) {
                animateSelected();
            }
        });
    });

    const getKeyframes = () => {
        const reduceMotion = shouldReduceMotion();
        if (!item()?.selected) {
            return reduceMotion ? [{'opacity': 1}, {'transform': 'none'}] : null;
        }
        const from: Keyframe = {};
        const isVertical = variant().includes('vertical');
        const fromRect = (tabs.find(item => item.previouslySelected)?.indicator().getBoundingClientRect() ?? ({} as DOMRect));
        const fromPos = isVertical ? fromRect.top : fromRect.left;
        const fromExtent = isVertical ? fromRect.height : fromRect.width;
        const toRect = indicatorElement.getBoundingClientRect();
        const toPos = isVertical ? toRect.top : toRect.left;
        const toExtent = isVertical ? toRect.height : toRect.width;
        const axis = isVertical ? 'Y' : 'X';
        const scale = fromExtent / toExtent;
        if (!reduceMotion && fromPos !== undefined && toPos !== undefined &&
            !isNaN(scale)) {
            from['transform'] = `translate${axis}(${(fromPos - toPos).toFixed(4)}px) scale${axis}(${scale.toFixed(4)})`;
        } else {
            from['opacity'] = 0;
        }
        // note, including `transform: none` avoids quirky Safari behavior
        // that can hide the animation.
        return [from, {'transform': 'none'}];
    }

    const animateSelected = () => {
        if (indicatorElement === null) {
            return;
        }
        indicatorElement.getAnimations().forEach(a => {
            a.cancel();
        });
        const frames = getKeyframes();
        if (frames !== null) {
            indicatorElement.animate(frames, {duration: 400, easing: 'ease-out'});
        }
    }


    const handleClick = () => {
        if (componentProps.disabled || item()?.selected) {
            return;
        }
        dispatch('selected', item());
    }

    return (
        <div
            {...tabProps}
            class={'tab-wrapper'}
            classList={{
                'tab--selected': item() && item().selected,
                'tab--disabled': item() && item().disabled,
                'tab--primary': variant().includes('primary'),
                'tab--secondary': variant().includes('secondary'),
                'tab--vertical': variant().includes('vertical'),
            }}
            onClick={handleClick}
        >
            <button
                ref={buttonElement}
                {...rippleHandlers}
                use:focusController={{
                    disabled: !componentProps.focusable || componentProps.disabled || !componentProps.showFocusRing,
                    inward: true,
                }}
                class={'button'}
                role={'tab'}
                tabIndex={componentProps.focusable && !componentProps.disabled ? 0 : -1}
                aria-selected={componentProps.selected}
                disabled={componentProps.disabled}
                aria-label={componentProps.ariaLabel}
            >
                <Elevation/>
                <Ripple listen={listen}></Ripple>
                <span class="touch"></span>
                <div
                    class="content"
                    classList={{
                        'inline-icon': inlineIcon(),
                    }}
                >
                    <span class={'icon'}>
                        {componentProps.icon}
                    </span>
                    <span class="label">
                        {componentProps.label}
                    </span>
                    <div
                        ref={indicatorElement}
                        class="indicator"
                    />
                </div>
            </button>
        </div>
    )
}
