import {MenuItemData} from '../menu';

export type SelectOptionItem = {
    value: string;
} & MenuItemData;

export type SelectOptionRecord = [SelectOptionItem, number];

export function getSelectedItems(items: SelectOptionItem[]) {
    const selectedItemRecords: SelectOptionRecord[] = [];

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.state.selected) {
            selectedItemRecords.push([item, i]);
        }
    }

    return selectedItemRecords;
}

export class RequestSelectionEvent extends Event {
    constructor(public selectedOption: SelectOptionItem) {
        super('request-selection', {bubbles: true, composed: true});
    }
}

export class RequestDeselectionEvent extends Event {
    constructor(public deselectedOption: SelectOptionItem) {
        super('request-deselection', {bubbles: true, composed: true});
    }
}
