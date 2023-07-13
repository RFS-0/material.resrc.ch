import {Component, createMemo, For, onMount} from 'solid-js';
import {selectTab, TabItemData, updateFocusableTabs, Variant} from './shared';
import {Tab, TabProps} from './Tab';
import {createStore} from 'solid-js/store';

const NAVIGATION_KEYS = new Map([
    ['default', new Set(['Home', 'End'])],
    ['horizontal', new Set(['ArrowLeft', 'ArrowRight'])],
    ['vertical', new Set(['ArrowUp', 'ArrowDown'])]
]);

export type TabsProps = {
    disabled?: boolean;
    selectOnFocus?: boolean;
    items: Omit<TabProps, 'tabStore' | 'variant'>[];
    variant: Variant;
}

export const Tabs: Component<TabsProps> = (props) => {
    let tabElement: HTMLDivElement | null = null;

    const tabStore = createStore<TabItemData[]>([])

    const tabs = tabStore[0];

    const scrollMargin = 48;
    const selectOnFocus = createMemo(() => props.selectOnFocus || false);

    const focusedItem = () => {
        return tabs.find((item: TabItemData) => item.indicator().matches(':focus-within'));
    }

    const wasEventPrevented = async (event: Event, preventNativeDefault = false) => {
        if (preventNativeDefault) {
            // prevent native default to stop, e.g. scrolling.
            event.preventDefault();
            // reset prevention to see if user is cancelling this action.
            Object.defineProperties(event, {
                'defaultPrevented': {value: false, writable: true, configurable: true},
                'preventDefault': {
                    value() {
                        this.defaultPrevented = true;
                    },
                    writable: true,
                    configurable: true
                }
            });
        }
        // allow event to propagate to user code.
        await new Promise(requestAnimationFrame);
        return event.defaultPrevented;
    }

    const dispatchInteraction = async () => {
        // wait for items to render.
        await new Promise(requestAnimationFrame);
        const event = new Event('change', {bubbles: true});
        tabElement.dispatchEvent(event);
    }

    const handleSelected = async (e: CustomEvent<TabItemData>) => {
        selectTab(e.detail, tabStore);
        await dispatchInteraction();
    }

    function findFocusableItem(i = -1, prev = false, tries = 0) {
        const itemCount = tabs.length - 1;
        while (tabs[i]?.disabled && tries <= itemCount) {
            tries++;
            i = (i + (prev ? -1 : 1));
            if (i > itemCount) {
                return findFocusableItem(0, false, tries);
            } else if (i < 0) {
                return findFocusableItem(itemCount, true, tries);
            }
        }
        return tabs[i] ?? null;
    }

    const orientation = () => {
        return props.variant.includes('vertical') ? 'vertical' : 'horizontal';
    }

    const handleKeydown = async (e: KeyboardEvent) => {
        const {key} = e;
        const shouldHandleKey = NAVIGATION_KEYS.get('default')!.has(key) || NAVIGATION_KEYS.get(orientation())!.has(key);
        // await to after user may cancel event.
        if (!shouldHandleKey || (await wasEventPrevented(e, true)) || props.disabled) {
            return;
        }
        let indexToFocus: number;
        const focused: TabItemData = focusedItem() ?? tabs.find(item => item.selected);
        const itemCount = tabs.length;
        const isPrevKey = key === 'ArrowLeft' || key === 'ArrowUp';
        if (key === 'Home') {
            indexToFocus = 0;
        } else if (key === 'End') {
            indexToFocus = itemCount - 1;
        } else {
            const focusedIndex = tabs.indexOf(focused) || 0;
            indexToFocus = focusedIndex + (isPrevKey ? -1 : 1);
            indexToFocus = indexToFocus < 0 ? itemCount - 1 : indexToFocus % itemCount;
        }
        const itemToFocus = findFocusableItem(indexToFocus, key === 'End' || isPrevKey);
        if (itemToFocus !== null && itemToFocus !== focused) {
            updateFocusableTabs(itemToFocus, tabStore);
            itemToFocus.indicator().focus();
            if (selectOnFocus()) {
                selectTab(itemToFocus, tabStore);
                await dispatchInteraction();
            }
        }
    }

    const scrollItemIntoView = async (item = tabs.find(item => item.selected).indicator()) => {
        if (!item) {
            return;
        }
        const isVertical = orientation() === 'vertical';
        const offset = isVertical ? item.offsetTop : item.offsetLeft;
        const extent = isVertical ? item.offsetHeight : item.offsetWidth;
        const scroll = isVertical ? tabElement.scrollTop : tabElement.scrollLeft;
        const hostExtent = isVertical ? tabElement.offsetHeight : tabElement.offsetWidth;
        const min = offset - scrollMargin;
        const max = offset + extent - hostExtent + scrollMargin;
        const to = Math.min(min, Math.max(max, scroll));
        // type annotation because `instant` is valid but not included in type.
        const behavior = focusedItem() !== undefined ? 'smooth' : 'instant' as ScrollBehavior;
        tabElement.scrollTo({
            behavior,
            [isVertical ? 'left' : 'top']: 0,
            [isVertical ? 'top' : 'left']: to
        });
    }

    const handleKeyup = async () => {
        await scrollItemIntoView(focusedItem().indicator() ?? tabs.find(item => item.selected).indicator());
    };

    onMount(() => {
        tabElement.addEventListener('keydown', handleKeydown);
        tabElement.addEventListener('keyup', handleKeyup);
    });

    return (
        <div ref={tabElement}>
            <For each={props.items}>
                {(tabProps) => {
                    return <Tab
                        {...tabProps}
                        tabStore={tabStore}
                        variant={props.variant}
                        onSelected={handleSelected}
                    />
                }}
            </For>
        </div>
    );
}
