import {MenuItemData} from './Menu';
import {SetStoreFunction, Store} from 'solid-js/store';
import {activateItem, deactivateItem} from '../list';
import {Accessor} from 'solid-js';

export interface TypeaheadControllerProperties {
    items: [get: Store<MenuItemData[]>, set: SetStoreFunction<MenuItemData[]>];
    typeaheadBufferTime: Accessor<number>;
    active: Accessor<boolean>;
}

type TypeaheadRecord = [number, MenuItemData, string];
export const TYPEAHEAD_RECORD = {
    INDEX: 0,
    ITEM: 1,
    TEXT: 2,
} as const;

export class TypeaheadController {
    private readonly _items: [get: Store<MenuItemData[]>, set: SetStoreFunction<MenuItemData[]>];
    private readonly _typeaheadBufferTime: Accessor<number>;
    private readonly _active: Accessor<boolean>;
    private typeaheadRecords: TypeaheadRecord[] = [];
    private typaheadBuffer = '';
    private cancelTypeaheadTimeout = 0;

    isTypingAhead = false;
    lastActiveRecord: TypeaheadRecord | null = null;

    constructor(private readonly props: TypeaheadControllerProperties) {
        this._items = props.items;
        this._typeaheadBufferTime = props.typeaheadBufferTime;
        this._active = props.active;
    }

    private get items() {
        return this._items;
    }

    private get active() {
        return this._active();
    }

    private  get typeaheadBufferTime() {
        return this._typeaheadBufferTime();
    }

    readonly onKeydown = (e: KeyboardEvent) => {
        if (this.isTypingAhead) {
            this.typeahead(e);
        } else {
            this.beginTypeahead(e);
        }
    };

    private beginTypeahead(e: KeyboardEvent) {
        if (!this.active) {
            return;
        }

        // We don't want to typeahead if the _beginning_ of the typeahead is a menu
        // navigation, or a selection. We will handle "Space" only if it's in the
        // middle of a typeahead
        if (e.code === 'Space' || e.code === 'Enter' ||
            e.code.startsWith('Arrow') || e.code === 'Escape') {
            return;
        }

        this.isTypingAhead = true;
        // Generates the record array data structure which is the index, the element
        // and a normalized header.
        const items = this.items[0];
        this.typeaheadRecords = items.map((el, index) => [index, el, el.headline.trim().toLowerCase()]);
        this.lastActiveRecord = this.typeaheadRecords.find(record => record[TYPEAHEAD_RECORD.ITEM].state.active) ?? null;
        if (this.lastActiveRecord) {
            deactivateItem(this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM], this.items)
        }
        this.typeahead(e);
    }

    private typeahead(e: KeyboardEvent) {
        clearTimeout(this.cancelTypeaheadTimeout);
        // Stop typingahead if one of the navigation or selection keys (except for
        // Space) are pressed
        if (e.code === 'Enter' || e.code.startsWith('Arrow') ||
            e.code === 'Escape') {
            this.endTypeahead();
            if (this.lastActiveRecord) {
                deactivateItem(this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM], this.items)
            }
            return;
        }

        // If Space is pressed, prevent it from selecting and closing the menu
        if (e.code === 'Space') {
            e.stopPropagation();
            e.preventDefault();
        }

        // Start up a new keystroke buffer timeout
        this.cancelTypeaheadTimeout = window.setTimeout(this.endTypeahead, this.typeaheadBufferTime);

        this.typaheadBuffer += e.key.toLowerCase();

        const lastActiveIndex = this.lastActiveRecord ? this.lastActiveRecord[TYPEAHEAD_RECORD.INDEX] : -1;
        const numRecords = this.typeaheadRecords.length;

        const rebaseIndexOnActive = (record: TypeaheadRecord) => {
            return (record[TYPEAHEAD_RECORD.INDEX] + numRecords - lastActiveIndex) % numRecords;
        };

        // records filtered and sorted / rebased around the last active index
        const matchingRecords = this.typeaheadRecords
                                    .filter(
                                        record => !record[TYPEAHEAD_RECORD.ITEM].state.disabled &&
                                            record[TYPEAHEAD_RECORD.TEXT].startsWith(
                                                this.typaheadBuffer))
                                    .sort((a, b) => rebaseIndexOnActive(a) - rebaseIndexOnActive(b));

        // Just leave if there's nothing that matches. Native select will just
        // choose the first thing that starts with the next letter in the alphabet
        // but that's out of scope and hard to localize
        if (matchingRecords.length === 0) {
            clearTimeout(this.cancelTypeaheadTimeout);
            if (this.lastActiveRecord) {
                deactivateItem(this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM], this.items)
            }
            this.endTypeahead();
            return;
        }

        const isNewQuery = this.typaheadBuffer.length === 1;
        let nextRecord: TypeaheadRecord;

        // This is likely the case that someone is trying to "tab" through different
        // entries that start with the same letter
        if (this.lastActiveRecord === matchingRecords[0] && isNewQuery) {
            nextRecord = matchingRecords[1] ?? matchingRecords[0];
        } else {
            nextRecord = matchingRecords[0];
        }

        if (this.lastActiveRecord) {
            deactivateItem(this.lastActiveRecord[TYPEAHEAD_RECORD.ITEM], this.items)
        }

        this.lastActiveRecord = nextRecord;
        activateItem(nextRecord[TYPEAHEAD_RECORD.ITEM], this.items)
        return;
    }

    private readonly endTypeahead = () => {
        this.isTypingAhead = false;
        this.typaheadBuffer = '';
        this.typeaheadRecords = [];
    };
}
