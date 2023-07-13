import {Accessor} from 'solid-js';
import {SetStoreFunction, Store} from 'solid-js/store';

type Style = '' | 'primary' | 'secondary';
type Orientation = '' | 'vertical' | 'horizontal'
export type Variant = Style | `${Style} ${Orientation}` | `${Orientation} ${Style}`;

export type TabItemData = {
    disabled: boolean;
    focusable: boolean;
    id: string;
    indicator: Accessor<HTMLDivElement>
    selected: boolean;
    previouslySelected: boolean;
}

export function addTab(tab: TabItemData, tabStore: [get: Store<TabItemData[]>, set: SetStoreFunction<TabItemData[]>]) {
    const tabs = tabStore[0];
    const setTabs = tabStore[1];
    const updatedTabs = [...tabs,  tab];
    setTabs(updatedTabs);
}

export function selectTab(tab: TabItemData, tabStore: [get: Store<TabItemData[]>, set: SetStoreFunction<TabItemData[]>]) {
    const tabs = tabStore[0];
    const setTabs = tabStore[1];
    const previouslySelected = tabs.findIndex(item => item.previouslySelected)
    const currentlySelected = tabs.findIndex(item => item.selected)
    const selected = tabs.findIndex(item => item.id === tab.id);
    const updatedTabs = [...tabs];
    if (previouslySelected !== -1) {
        updatedTabs[previouslySelected] = {
            ...updatedTabs[previouslySelected],
            previouslySelected: false,
        }
    }
    if (currentlySelected !== -1) {
        updatedTabs[currentlySelected] = {
            ...updatedTabs[currentlySelected],
            selected: false,
            previouslySelected: true,
            focusable: false,
        }
    }
    updatedTabs[selected] = {
        ...updatedTabs[selected],
        selected: true,
        focusable: true,
    }
    setTabs(updatedTabs);
}

export function updateFocusableTabs(tab: TabItemData, tabStore: [get: Store<TabItemData[]>, set: SetStoreFunction<TabItemData[]>]) {
    const tabs = tabStore[0];
    const setTabs = tabStore[1];
    const previouslyFocusable = tabs.findIndex(item => item.selected)
    const focusable = tabs.findIndex(item => item.id === tab.id);
    const updatedTabs = [...tabs];
    if (previouslyFocusable !== -1) {
        updatedTabs[previouslyFocusable] = {
            ...updatedTabs[previouslyFocusable],
            focusable: false,
        }
    }
    updatedTabs[focusable] = {
        ...updatedTabs[focusable],
        focusable: true,
    }
    setTabs(updatedTabs);
}
