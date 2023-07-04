import {createEffect, createSignal, JSX, mergeProps, on, onCleanup, onMount, Signal, splitProps} from 'solid-js';
import {
    SurfacePositionHelper as MenuPositionHelper, SurfacePositionHelperProps as MenuPositionHelperProps
} from "./menu-position-helper";
import {Elevation} from '../elevation';
import {
    activateItem, deactivateItem, getActiveItem, getFirstActivatableItem, getLastActivatableItem, List, ListItemData
} from '../list';
import './styles/menu-styles.css'
import {SetStoreFunction, Store} from 'solid-js/store';
import {ActivateTypeaheadEvent, DeactivateTypeaheadEvent, isClosableKey, isElementInSubtree} from './shared';
import {createEventDispatcher} from '@solid-primitives/event-dispatcher';
import {createAnimationSignal, EASING} from '../motion';
import {TypeaheadController} from './typeahead-controller';

function getFocusedElement(activeDoc: Document | ShadowRoot = document):
    HTMLElement | null {
    const activeEl = activeDoc.activeElement as HTMLElement | null;

    if (!activeEl) {
        return null;
    }

    if (activeEl.shadowRoot) {
        return getFocusedElement(activeEl.shadowRoot) ?? activeEl;
    }

    return activeEl;
}

export type MenuItemData = {
    state: {
        active: boolean;
        disabled: boolean;
        focusOnActivation: boolean;
        selected: boolean;
    }
    close?: () => void;
    focus?: () => void;
} & Omit<ListItemData, 'state'>

export type DefaultFocusState = 'NONE' | 'LIST_ROOT' | 'FIRST_ITEM' | 'LAST_ITEM';

export function unselectItem(itemToDeactivate: MenuItemData, itemStore: [get: Store<MenuItemData[]>, set: SetStoreFunction<MenuItemData[]>]) {
    const [items, setItems] = itemStore;
    const indexOfItemToUnselect = items.findIndex((item) => item.id === itemToDeactivate.id);
    if (indexOfItemToUnselect !== -1) {
        const itemToUnselect = items[indexOfItemToUnselect];
        const unselected = {...itemToUnselect, state: {...itemToUnselect.state, selected: false}}
        setItems((items) => [...items.slice(0, indexOfItemToUnselect), unselected, ...items.slice(indexOfItemToUnselect + 1)]);
        deactivateItem(unselected, itemStore);
    }
}

export function selectItem(itemToSelect: MenuItemData, itemStore: [get: Store<MenuItemData[]>, set: SetStoreFunction<MenuItemData[]>]) {
    const [items, setItems] = itemStore;
    const indexOfItemToSelect = items.findIndex((item) => item.id === itemToSelect.id);
    const selected = {...itemToSelect, state: {...itemToSelect.state, selected: true}}
    setItems((items) => [...items.slice(0, indexOfItemToSelect), selected, ...items.slice(indexOfItemToSelect + 1)]);
    activateItem(selected, itemStore);
}

export type MenuProps = {
    defaultFocus?: DefaultFocusState;
    fixed?: boolean;
    hasOverflow?: boolean;
    items: [get: Store<MenuItemData[]>, set: SetStoreFunction<MenuItemData[]>];
    itemRenderer: (item: MenuItemData) => JSX.Element;
    listTabIndex?: number;
    onClosing?: (evt: CustomEvent<void>) => void;
    onClosed?: (evt: CustomEvent<void>) => void;
    onOpening?: (evt: CustomEvent<void>) => void;
    onOpened?: (evt: CustomEvent<void>) => void;
    open: Signal<boolean>;
    positionHelper: Partial<MenuPositionHelperProps>;
    quick?: boolean;
    showFocusRing?: boolean;
    skipRestoreFocus?: boolean;
    stayOpenOnFocusout?: boolean;
    stayOpenOnOutsideClick?: boolean;
    type: 'menu' | 'list';
    typeAheadController?: TypeaheadController;
};

export const Menu = (props: MenuProps) => {
    const dispatch = createEventDispatcher(props);
    const openCloseAnimationSignal = createAnimationSignal();
    const [componentProps, menuProps] = splitProps(
        props,
        [
            'defaultFocus',
            'fixed',
            'hasOverflow',
            'items',
            'itemRenderer',
            'listTabIndex',
            'open',
            'quick',
            'showFocusRing',
            'skipRestoreFocus',
            'stayOpenOnFocusout',
            'stayOpenOnOutsideClick',
            'type',
            'typeAheadController',
        ],
    );

    const [items,] = componentProps.items;

    let menuElement: HTMLDivElement | null = null;
    let listElement: HTMLUListElement | null = null;
    let surfaceElement: HTMLDivElement | null = null;
    let lastFocusedElement: HTMLElement | null = null;

    const fixed = props.fixed || false;
    const quick = props.quick || false;
    const [open, setOpen] = componentProps.open;
    const [stayOpenOnFocusout, setStayOpenOnFocusout] = createSignal(componentProps.stayOpenOnFocusout || false);
    const hasOverflow = props.hasOverflow
    let skipRestoreFocus = componentProps.skipRestoreFocus || false;
    const defaultFocus = componentProps.defaultFocus || 'NONE';

    const onOpened = () => {
        lastFocusedElement = getFocusedElement();
        if (!listElement) {
            return;
        }

        const activeItemRecord = getActiveItem(items);

        if (activeItemRecord && defaultFocus !== 'NONE') {
            deactivateItem(activeItemRecord.item, componentProps.items);
        }

        switch (defaultFocus) {
            case 'FIRST_ITEM':
                const first = getFirstActivatableItem(items);
                if (first) {
                    selectItem(first, componentProps.items);
                }
                break;
            case 'LAST_ITEM':
                const last = getLastActivatableItem(items);
                if (last) {
                    selectItem(last, componentProps.items);
                }
                break;
            case 'LIST_ROOT':
                listElement?.focus();
                break;
            default:
            case 'NONE':
                // Do nothing.
                break;
        }

        if (quick) {
            dispatch('opening');
            dispatch('opened');
        } else {
            animateOpen();
        }
    };

    const beforeClose = async () => {
        if (!skipRestoreFocus) {
            lastFocusedElement?.focus?.();
        }

        if (!quick) {
            await animateClose();
        }

        setTimeout(() => setOpen(false), 150)
    };

    const onClosed = () => {
        if (quick) {
            dispatch('closing');
            dispatch('closed');
        }
    };

    const menuPositionHelperProps: MenuPositionHelperProps = mergeProps(
        {
            anchorCorner: 'END_START',
            menuCorner: 'START_START',
            surfaceEl: () => surfaceElement,
            anchorEl: null,
            isOpen: open,
            isTopLayer: fixed,
            xOffset: 0,
            yOffset: 0,
        } as MenuPositionHelperProps,
        props.positionHelper
    )
    const menuPostionHelper = new MenuPositionHelper(menuPositionHelperProps);

    const [typeaheadActive, setTypeaheadActive] = createSignal(false);
    const [typeaheadDelay,] = createSignal(500);
    const typeaheadController = componentProps.typeAheadController || new TypeaheadController({
        active: typeaheadActive,
        items: componentProps.items,
        typeaheadBufferTime: typeaheadDelay
    })

    createEffect(
        on(
            open,
            async (isOpen, wasOpen) => {
                const hasAnchor = !!menuPositionHelperProps.anchorEl()
                const hasSurface = !!menuPositionHelperProps.surfaceEl()
                if (isOpen !== wasOpen && hasAnchor && hasSurface) {
                    if (isOpen) {
                        await menuPostionHelper.position().then(onOpened);
                    } else {
                        await beforeClose().then(() => menuPostionHelper.close()).then(onClosed);
                    }
                }
            },
            {defer: true}
        )
    );


    const handleFocusout = (e: FocusEvent) => {
        if (stayOpenOnFocusout()) {
            return;
        }
        // Stop propagation to prevent nested menus from interfering with each other
        e.stopPropagation();

        if (e.relatedTarget) {
            // Don't close the menu if we are switching focus between menu,
            // menu-item, and list
            if (isElementInSubtree(e.relatedTarget, menuElement)) {
                return;
            }
        }
        const oldRestoreFocus = skipRestoreFocus;
        // allow focus to continue to the next focused object rather than returning
        skipRestoreFocus = true;
        close();
        // return to previous behavior
        skipRestoreFocus = oldRestoreFocus;
    }


    const handleListKeydown = (e: KeyboardEvent) => {
        if (e.target === listElement && !e.defaultPrevented && isClosableKey(e.code)) {
            e.preventDefault();
            close();
        }
        typeaheadController.onKeydown(e);
    };

    const openDirection = (): 'UP' | 'DOWN' => {
        const menuCornerBlock = menuPostionHelper.props.menuCorner.split('_')[0];
        return menuCornerBlock === 'START' ? 'DOWN' : 'UP';
    }

    // TODO: item height of first item is stretched to surface height; should probably be max-height or a fixed height
    const animateOpen = () => {
        if (!surfaceElement || !listElement) {
            return;
        }
        const direction = openDirection();
        dispatch('opening');
        // needs to be imperative because we don't want to mix animation and Lit
        // render timing
        surfaceElement.classList.toggle('menu--animating', true);

        const signal = openCloseAnimationSignal.start();
        const height = surfaceElement.offsetHeight;
        const openingUpwards = direction === 'UP';
        const children = items;
        const FULL_DURATION = 500;
        const SURFACE_OPACITY_DURATION = 50;
        const ITEM_OPACITY_DURATION = 250;
        // We want to fit every child fade-in animation within the full duration of
        // the animation.
        const DELAY_BETWEEN_ITEMS = (FULL_DURATION - ITEM_OPACITY_DURATION) / children.length;

        const surfaceHeightAnimation = surfaceElement.animate([{height: '0px'}, {height: `${height}px`}], {
            duration: FULL_DURATION,
            easing: EASING.EMPHASIZED,
        });
        // When we are opening upwards, we want to make sure the last item is always
        // in view, so we need to translate it upwards the opposite direction of the
        // height animation
        const upPositionCorrectionAnimation = listElement.animate(
            [
                {transform: openingUpwards ? `translateY(-${height}px)` : ''},
                {transform: ''}
            ],
            {duration: FULL_DURATION, easing: EASING.EMPHASIZED}
        );

        const surfaceOpacityAnimation = surfaceElement.animate(
            [{opacity: 0}, {opacity: 1}], SURFACE_OPACITY_DURATION
        );

        const childrenAnimations: Array<[HTMLElement, Animation]> = [];
        for (let i = 0; i < children.length; i++) {
            // If we are animating upwards, then reverse the children list.
            const directionalIndex = openingUpwards ? children.length - 1 - i : i;
            const child = document.getElementById(children[directionalIndex].id);
            const animation = child.animate([{opacity: 0}, {opacity: 1}], {
                duration: ITEM_OPACITY_DURATION,
                delay: DELAY_BETWEEN_ITEMS * i,
            });
            // Make them all initially hidden and then clean up at the end of each
            // animation.
            child.classList.toggle('menu__item--hidden', true);
            animation.addEventListener('finish', () => {
                child.classList.toggle('menu__item--hidden', false);
            });
            childrenAnimations.push([child, animation]);
        }

        signal.addEventListener('abort', () => {
            surfaceHeightAnimation.cancel();
            upPositionCorrectionAnimation.cancel();
            surfaceOpacityAnimation.cancel();
            childrenAnimations.forEach(([child, animation]) => {
                child.classList.toggle('menu__item--hidden', false);
                animation.cancel();
            });
        });

        surfaceHeightAnimation.addEventListener('finish', () => {
            surfaceElement.classList.toggle('menu--animating', false);
            openCloseAnimationSignal.finish();
            dispatch('opened');
        });
    }

    const animateClose = () => {
        let resolve!: (value: unknown) => void;
        let reject!: () => void;

        // This promise blocks the surface position controller from setting
        // display: none on the surface which will interfere with this animation.
        const animationEnded = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        if (!surfaceElement || !listElement) {
            reject();
            return animationEnded;
        }

        const direction = openDirection();
        const closingDownwards = direction === 'UP';
        dispatch('closing');
        // needs to be imperative because we don't want to mix animation and Lit
        // render timing
        surfaceElement.classList.toggle('menu--animating', true);
        const signal = openCloseAnimationSignal.start();
        const height = surfaceElement.offsetHeight;
        const children = items;
        const FULL_DURATION = 150;
        const SURFACE_OPACITY_DURATION = 50;
        // The surface fades away at the very end
        const SURFACE_OPACITY_DELAY = FULL_DURATION - SURFACE_OPACITY_DURATION;
        const ITEM_OPACITY_DURATION = 50;
        const ITEM_OPACITY_INITIAL_DELAY = 50;
        const END_HEIGHT_PERCENTAGE = .35;

        // We want to fit every child fade-out animation within the full duration of
        // the animation.
        const DELAY_BETWEEN_ITEMS = (FULL_DURATION - ITEM_OPACITY_INITIAL_DELAY - ITEM_OPACITY_DURATION) / children.length;

        // The mock has the animation shrink to 35%
        const surfaceHeightAnimation = surfaceElement.animate(
            [
                {height: `${height}px`},
                {height: `${height * END_HEIGHT_PERCENTAGE}px`}
            ],
            {
                duration: FULL_DURATION,
                easing: EASING.EMPHASIZED_ACCELERATE,
            }
        );

        // When we are closing downwards, we want to make sure the last item is
        // always in view, so we need to translate it upwards the opposite direction
        // of the height animation
        const downPositionCorrectionAnimation = listElement.animate(
            [
                {transform: ''}, {
                transform: closingDownwards ?
                    `translateY(-${height * (1 - END_HEIGHT_PERCENTAGE)}px)` :
                    ''
            }
            ],
            {duration: FULL_DURATION, easing: EASING.EMPHASIZED_ACCELERATE}
        );

        const surfaceOpacityAnimation = surfaceElement.animate(
            [{opacity: 1}, {opacity: 0}],
            {duration: SURFACE_OPACITY_DURATION, delay: SURFACE_OPACITY_DELAY}
        );

        const childrenAnimations: Array<[HTMLElement, Animation]> = [];

        for (let i = 0; i < children.length; i++) {
            // If the animation is closing upwards, then reverse the list of
            // children so that we animate in the opposite direction.
            const directionalIndex = closingDownwards ? i : children.length - 1 - i;
            const child = document.getElementById(children[directionalIndex].id);
            const animation = child.animate([{opacity: 1}, {opacity: 0}], {
                duration: ITEM_OPACITY_DURATION,
                delay: ITEM_OPACITY_INITIAL_DELAY + DELAY_BETWEEN_ITEMS * i,
            });

            // Make sure the items stay hidden at the end of each child animation.
            // We clean this up at the end of the overall animation.
            animation.addEventListener('finish', () => {
                child.classList.toggle('menu__item--hidden', true);
            });
            childrenAnimations.push([child, animation]);
        }

        signal.addEventListener('abort', () => {
            surfaceHeightAnimation.cancel();
            downPositionCorrectionAnimation.cancel();
            surfaceOpacityAnimation.cancel();
            childrenAnimations.forEach(([child, animation]) => {
                animation.cancel();
                child.classList.toggle('menu__item--hidden', false);
            });
            reject();
        });

        surfaceHeightAnimation.addEventListener('finish', () => {
            surfaceElement.classList.toggle('menu--animating', false);
            childrenAnimations.forEach(([child]) => {
                child.classList.toggle('menu__item--hidden', false);
            });
            openCloseAnimationSignal.finish();
            dispatch('closed');
            resolve(true);
        });

        return animationEnded;
    }

    const onWindowClick = (e: MouseEvent) => {
        if (!componentProps.stayOpenOnOutsideClick && !e.composedPath().includes(menuElement)) {
            setOpen(false);
        }
    };

    const onCloseMenu = () => {
        close();
    };

    const onDeactivateItems = (e: Event) => {
        e.stopPropagation();
        for (const item of items) {
            deactivateItem(item, componentProps.items);
        }
    }

    const handleDeactivateTypeahead = (e: DeactivateTypeaheadEvent) => {
        // stopPropagation so that this does not deactivate any typeaheads in menus
        // nested above it e.g. md-sub-menu-item
        e.stopPropagation();
        setTypeaheadActive(false);
    }

    const handleActivateTypeahead = (e: ActivateTypeaheadEvent) => {
        // stopPropagation so that this does not activate any typeaheads in menus
        // nested above it e.g. md-sub-menu-item
        e.stopPropagation();
        setTypeaheadActive(true);
    }

    const handleStayOpenOnFocusout = (e: FocusEvent) => {
        e.stopPropagation();
        setStayOpenOnFocusout(false);
    };

    const handleCloseOnFocusout = (e: Event) => {
        e.stopPropagation();
        setStayOpenOnFocusout(false);
    }

    const focus = () => {
        listElement?.focus();
    }

    const close = () => {
        setOpen(false);
        items.forEach(item => {
            item.close?.();
        });
    }

    onMount(() => {
        window.addEventListener('click', onWindowClick, {capture: true});
        listElement.addEventListener('keydown', handleListKeydown, {capture: true});
    });

    onCleanup(() => {
        window.removeEventListener('click', onWindowClick, {capture: true});
        listElement.removeEventListener('keydown', handleListKeydown, {capture: true});
    });

    return (
        <div
            ref={menuElement}
            class='menu__container'
            style={menuPostionHelper.containerStyles()}
        >
            <div
                {...menuProps}
                ref={surfaceElement}
                class='menu-shared menu'
                classList={{
                    'menu--open': open(),
                    'menu--fixed': fixed,
                    'menu--has-overflow': hasOverflow
                }}
                style={menuPostionHelper.surfaceStyles()}
                onFocus={focus}
                onFocusOut={handleFocusout}
            >
                <Elevation/>
                <List
                    ref={listElement}
                    onKeyDown={handleListKeydown}
                    items={componentProps.items}
                    itemRenderer={componentProps.itemRenderer}
                    on:close-menu={onCloseMenu}
                    on:deactivate-items={onDeactivateItems}
                    on:activate-typeahead={handleActivateTypeahead}
                    on:deactivate-typeahead={handleDeactivateTypeahead}
                    on:stay-open-on-focusout={handleStayOpenOnFocusout}
                    on:close-on-focusout={handleCloseOnFocusout}
                    tabIndex={0}
                    type={componentProps.type}
                />
            </div>
        </div>
    );
}
