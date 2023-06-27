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

export function isElementInSubtree(
    target: EventTarget, container: EventTarget) {
    // Dispatch a composed, bubbling event to check its path to see if the
    // newly-focused element is contained in container's subtree
    const focusEv = new Event('md-contains', {bubbles: true, composed: true});
    let composedPath: EventTarget[] = [];
    const listener = (ev: Event) => {
        composedPath = ev.composedPath();
    };

    container.addEventListener('md-contains', listener);
    target.dispatchEvent(focusEv);
    container.removeEventListener('md-contains', listener);

    const isContained = composedPath.length > 0;
    return isContained;
}
