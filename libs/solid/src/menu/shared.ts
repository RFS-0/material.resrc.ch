import {MenuItemData} from './Menu';

export interface Reason {
    kind: string;
}

export const SELECTION_KEY = {
    SPACE: 'Space',
    ENTER: 'Enter',
} as const;

export const CLOSE_REASON = {
    CLICK_SELECTION: 'CLICK_SELECTION',
    KEYDOWN: 'KEYDOWN',
} as const;

export interface ClickReason extends Reason {
    kind: typeof CLOSE_REASON.CLICK_SELECTION;
}

export interface KeydownReason extends Reason {
    kind: typeof CLOSE_REASON.KEYDOWN;
    key: string;
}

export type DefaultReasons = ClickReason | KeydownReason;

export class CloseMenuEvent<T extends Reason = DefaultReasons> extends Event {
    readonly itemPath: MenuItemData[];

    constructor(public initiator: MenuItemData, readonly reason: T) {
        super('close-menu', {bubbles: true, composed: true});
        this.itemPath = [initiator];
    }
}

export const KEYDOWN_CLOSE_KEYS = {
    ESCAPE: 'Escape',
    SPACE: SELECTION_KEY.SPACE,
    ENTER: SELECTION_KEY.ENTER,
} as const;

type Values<T> = T[keyof T];

export function isClosableKey(code: string):
    code is Values<typeof KEYDOWN_CLOSE_KEYS> {
    return Object.values(KEYDOWN_CLOSE_KEYS).some(value => (value === code));
}
