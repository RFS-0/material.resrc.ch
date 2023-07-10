import {Component, createEffect, createMemo, JSX, on, onMount, splitProps} from 'solid-js';
import './styles/tab-styles.css'
import {focusController as fc} from '../focus';
import {Elevation} from '../elevation';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import {SetStoreFunction, Store} from 'solid-js/store';
import {addTab, TabItemData, Tabs} from './shared';

type Style = '' | 'primary' | 'secondary';
type Orientation = '' | 'vertical';

export type Variant = Style | `${Style} ${Orientation}` | `${Orientation} ${Style}`;

export type TabProps = {
    ariaLabel?: string;
    disabled?: boolean;
    focusable?: boolean;
    icon?: JSX.Element;
    inlineIcon?: boolean;
    label?: string;
    selected: boolean;
    tabs: [get: Store<Tabs>, set: SetStoreFunction<Tabs>];
    variant?: Variant;
}

function shouldReduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const Tab: Component<TabProps> = (props) => {
    //noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, ] = splitProps(props, [
        'ariaLabel',
        'disabled',
        'focusable',
        'icon',
        'inlineIcon',
        'label',
        'selected',
        'tabs',
        'variant'
    ]);

    const tabs = componentProps.tabs[0];
    const variant = createMemo(() => props.variant || 'primary');
    const inlineIcon = createMemo(() => props.inlineIcon || false);
    const selected = createMemo(() => props.selected || false);

    let tab: TabItemData | null = null;

    let buttonElement: HTMLButtonElement | null = null;
    let indicatorElement: HTMLDivElement | null = null;

    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);

    onMount(() => {
        tab = {
            indicator: createMemo(() => indicatorElement),
        }
        addTab(tab, componentProps.tabs);
    });

    const getKeyframes = () => {
        const reduceMotion = shouldReduceMotion();
        if (!selected()) {
            return reduceMotion ? [{'opacity': 1}, {'transform': 'none'}] : null;
        }
        const from: Keyframe = {};
        const isVertical = variant().includes('vertical');
        const fromRect = (tabs?.previousSelectedItem?.indicator().getBoundingClientRect() ?? ({} as DOMRect));
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

    createEffect(() => {
        on([selected], () => {
            animateSelected();
        });
        console.log('tabs', tabs.allItems.map(item => JSON.stringify(item.indicator)));
    });

    return (
        <div
            class={'tab-wrapper'}
            classList={{
                'tab--selected': componentProps.selected,
                'tab--disabled': componentProps.disabled,
                'tab--primary': variant().includes('primary'),
                'tab--secondary': variant().includes('secondary'),
                'tab--vertical': variant().includes('vertical'),
            }}
        >
            <button
                ref={buttonElement}
                {...rippleHandlers}
                use:focusController={{
                    disabled: !componentProps.focusable || componentProps.disabled,
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
