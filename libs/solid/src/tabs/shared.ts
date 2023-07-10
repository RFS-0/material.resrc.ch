import {Accessor} from 'solid-js';
import {SetStoreFunction, Store} from 'solid-js/store';

export type Tabs = {
    selectedItem: TabItemData | null;
    previousSelectedItem: TabItemData | null;
    allItems: TabItemData[];
}

export type TabItemData = {
    indicator?: Accessor<HTMLDivElement>
}

export function addTab(tab: TabItemData, tabStore: [get: Store<Tabs>, set: SetStoreFunction<Tabs>]) {
    console.log('addTab', tab);
    const tabs = tabStore[0];
    const setTabs = tabStore[1];
    const updatedTabs = {...tabs, allItems: [...tabs.allItems, tab]};
    setTabs(updatedTabs);
}

export function selectTab(tab: TabItemData, tabStore: [get: Store<Tabs>, set: SetStoreFunction<Tabs>]) {
    const tabs = tabStore[0];
    const setTabs = tabStore[1];
    const updatedTabs = {
        ...tabs,
        selectedItem: tab,
        previousSelectedItem: tabs.selectedItem
    };
    setTabs(updatedTabs);
}

export function getSelectedTab(tabStore: [get: Store<Tabs>, set: SetStoreFunction<Tabs>]): TabItemData | undefined {
    const tabs = tabStore[0];
    return tabs.selectedItem;
}
