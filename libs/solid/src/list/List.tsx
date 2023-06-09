import {JSX, splitProps} from 'solid-js';
import {SetStoreFunction, Store} from 'solid-js/store';
import './styles/list-styles.css'
import {composeEventHandlers} from '../controller';

export type ListItemData = {
    headline?: string
    id: string
    multiLineSupportingText?: string
    state: {
        active?: boolean
        disabled?: boolean
        focusOnActivation?: boolean
    }
    supportingText?: string
    trailingSupportingText?: string
}

export type ListProps = {
    items: [get: Store<ListItemData[]>, set: SetStoreFunction<ListItemData[]>];
    itemRenderer: (item: ListItemData) => JSX.Element;
    tabIndex?: number;
    type?: 'list' | 'menu';
} & JSX.HTMLAttributes<HTMLUListElement>;


const NAVIGABLE_KEYS = {
    ArrowDown: 'ArrowDown',
    ArrowUp: 'ArrowUp',
    Home: 'Home',
    End: 'End',
} as const;

const navigableKeySet = new Set(Object.values(NAVIGABLE_KEYS));

function isNavigableKey(key: string): key is NavigatableValues {
    return navigableKeySet.has(key as NavigatableValues);
}

type NavigatableValues = typeof NAVIGABLE_KEYS[keyof typeof NAVIGABLE_KEYS];

type ItemRecord = {
    item: ListItemData;
    index: number;
}

export function handleItemClick(event: CustomEvent<ListItemData>, itemStore: [get: Store<ListItemData[]>, set: SetStoreFunction<ListItemData[]>]) {
    const clickedItem = event.detail;
    const items = itemStore[0];
    const itemToDeactivate = items.find((item) => item.state.active === true);
    if (itemToDeactivate) {
        deactivateItem(itemToDeactivate, itemStore);
    }
    activateItem(clickedItem, itemStore);
}

export function deactivateItem(itemToDeactivate: ListItemData, itemStore: [get: Store<ListItemData[]>, set: SetStoreFunction<ListItemData[]>]) {
    const [items, setItems] = itemStore;
    const indexOfItemToDeactivate = items.findIndex((item) => item.id === itemToDeactivate.id);
    if (indexOfItemToDeactivate !== -1) {
        const itemToDeactivate = items[indexOfItemToDeactivate];
        const deactivated = {...itemToDeactivate, state: {...itemToDeactivate.state, active: false}}
        setItems((items) => [...items.slice(0, indexOfItemToDeactivate), deactivated, ...items.slice(indexOfItemToDeactivate + 1)]);
    }
}

export function activateItem(itemToActivate: ListItemData, itemStore: [get: Store<ListItemData[]>, set: SetStoreFunction<ListItemData[]>]) {
    const [items, setItems] = itemStore;
    const indexOfItemToActivate = items.findIndex((item) => item.id === itemToActivate.id);
    const activated = {...itemToActivate, state: {...itemToActivate.state, active: true}}
    setItems((items) => [...items.slice(0, indexOfItemToActivate), activated, ...items.slice(indexOfItemToActivate + 1)]);
}

export function getActiveItem(items: ListItemData[]) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.state.active) {
            return {
                item,
                index: i,
            } as ItemRecord;
        }
    }
    return null;
}

export function getFirstActivatableItem<T extends unknown & ListItemData>(items: T[]): T {
    for (const item of items) {
        if (!item.state.disabled) {
            return item;
        }
    }
    return null;
}

export function getLastActivatableItem<T extends unknown & ListItemData>(items: T[]) {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        if (!item.state.disabled) {
            return item;
        }
    }
    return null;
}

export const List = (props: ListProps) => {
    const [componentProps, listProps] = splitProps(props, [
        'items',
        'itemRenderer',
        'tabIndex',
        'ref',
        'type',
    ]);

    const [items, setItems] = componentProps.items;

    const updateItem = (toBeUpdated: ListItemData, mutate: (item: ListItemData) => ListItemData) => {
        const index = items.findIndex((item) => item.id === toBeUpdated.id);
        const item = items[index];
        const updated = mutate(item);
        setItems((items) => [...items.slice(0, index), updated, ...items.slice(index + 1)]);
    }

    const updateItemRecord = (toBeUpdated: ItemRecord, mutate: (item: ListItemData) => ListItemData) => {
        const index = toBeUpdated.index;
        const item = toBeUpdated.item;
        const updated = mutate(item);
        setItems((items) => [...items.slice(0, index), updated, ...items.slice(index + 1)]);
    }

    let listElement: HTMLUListElement | null = null;
    const refCallback = (el: HTMLUListElement) => {
        listElement = el;
        if (typeof componentProps.ref === 'function') {
            componentProps.ref(el);
        }
    }

    const getNextItem = (index: number) => {
        for (let i = 1; i < items.length; i++) {
            const nextIndex = (i + index) % items.length;
            const item = items[nextIndex];
            if (!item.state.disabled) {
                return item;
            }
        }

        return items[index] ? items[index] : null;
    }

    const activateFirstItem = () => {
        const firstItem = getFirstActivatableItem(items);
        if (firstItem) {
            updateItem(
                firstItem,
                (item) => ({
                    ...item,
                    state: {
                        ...item.state,
                        active: true
                    }
                })
            );
        }
        return firstItem;
    }

    const activateNextItemInternal = (activeItemRecord: null | ItemRecord) => {
        if (activeItemRecord) {
            const next = getNextItem(activeItemRecord.index);
            if (next) {
                updateItem(
                    next,
                    (item) => ({
                        ...item,
                        state: {
                            ...item.state,
                            active: true
                        }
                    })
                );
            }
            return next;
        } else {
            return activateFirstItem();
        }
    }

    const getPrevItem = (index: number) => {
        for (let i = 1; i < items.length; i++) {
            const prevIndex = (index - i + items.length) % items.length;
            const item = items[prevIndex];
            if (!item.state.disabled) {
                return {item, index: prevIndex};
            }
        }
    }

    const getLastActivatableItem = () => {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (!item.state.disabled) {
                return item;
            }
        }
        return null;
    }

    const activateLastItem = () => {
        const lastItem = getLastActivatableItem();
        if (lastItem) {
            updateItem(
                lastItem,
                (item) => ({
                    ...item,
                    state: {
                        ...item.state,
                        active: true
                    }
                })
            );
        }
        return lastItem;
    }

    const activatePreviousItemInternal = (activeItemRecord: null | ItemRecord) => {
        if (activeItemRecord) {
            const prev = getPrevItem(activeItemRecord.index);
            if (prev) {
                updateItemRecord(
                    prev,
                    (item) => ({
                        ...item,
                        state: {
                            ...item.state,
                            active: true
                        }
                    })
                )
                return prev;
            } else {
                return activateLastItem();
            }
        }
    }

    const handleKeydown = (event: KeyboardEvent) => {
        console.log('lissssst keydown', event);
        const key = event.key;
        if (!isNavigableKey(key)) {
            return;
        }
        if (!items.length) {
            return;
        }
        const activeItemRecord = getActiveItem(items);
        if (activeItemRecord) {
            updateItemRecord(
                activeItemRecord,
                (item) => ({
                    ...item,
                    state: {
                        ...item.state,
                        active: false
                    }
                })
            );
        }
        event.preventDefault();
        switch (key) {
            // Activate the next item
            case NAVIGABLE_KEYS.ArrowDown:
                activateNextItemInternal(activeItemRecord);
                break;
            // Activate the previous item
            case NAVIGABLE_KEYS.ArrowUp:
                activatePreviousItemInternal(activeItemRecord);
                break;
            // Activate the first item
            case NAVIGABLE_KEYS.Home:
                activateFirstItem();
                break;
            // Activate the last item
            case NAVIGABLE_KEYS.End:
                activateLastItem();
                break;
            default:
                break;
        }
    }

    return (
        <ul
            ref={refCallback}
            class={'list-shared list'}
            role={componentProps?.type || undefined}
            {...listProps}
            tabIndex={componentProps.tabIndex || 0}
            onKeyDown={
                composeEventHandlers(
                    [
                        listProps.onKeyDown,
                        handleKeydown
                    ]
                )
            }
        >
            {items.map(componentProps.itemRenderer)}
        </ul>
    );
}
