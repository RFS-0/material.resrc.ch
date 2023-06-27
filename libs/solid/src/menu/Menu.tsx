import {createEffect, JSX, mergeProps, Signal, splitProps} from 'solid-js';
import {
    SurfacePositionHelper as MenuPositionHelper, SurfacePositionHelperProps as MenuPositionHelperProps
} from "./menu-position-helper";
import {Elevation} from '../elevation';
import {List, ListItemData} from '../list';
import './styles/menu-styles.css'
import {SetStoreFunction, Store} from 'solid-js/store';
import {isElementInSubtree} from './shared';

export type MenuItemData = {
    state: {
        active: boolean;
        disabled: boolean;
        focusOnActivation: boolean;
        selected: boolean;
    }
    close?: () => void;
    focus: () => void;
} & Omit<ListItemData, 'state'>

export type DefaultFocusState = 'NONE' | 'LIST_ROOT' | 'FIRST_ITEM' | 'LAST_ITEM';

export type MenuProps = {
    defaultFocus?: DefaultFocusState;
    hasOverflow?: boolean;
    itemRenderer: (item: MenuItemData) => JSX.Element;
    items: [get: Store<MenuItemData[]>, set: SetStoreFunction<MenuItemData[]>];
    listTabIndex?: number;
    open: Signal<boolean>;
    positionHelperProps: Partial<MenuPositionHelperProps>;
    quick?: boolean;
    showFocusRing?: boolean;
    skipRestoreFocus?: boolean;
    stayOpenOnFocusOut?: boolean;
    stayOpenOnOutsideClick?: boolean;
    typeaheadActive?: boolean;
};


export const Menu = (props: MenuProps) => {
    const [componentProps, positionHelperProps, menuProps] = splitProps(
        props,
        [
            'defaultFocus',
            'hasOverflow',
            'itemRenderer',
            'items',
            'listTabIndex',
            'open',
            'quick',
            'showFocusRing',
            'skipRestoreFocus',
            'stayOpenOnFocusOut',
            'stayOpenOnOutsideClick',
            'typeaheadActive',
        ],
        [
            'positionHelperProps'
        ]
    );

    const [items, setItems] = componentProps.items;

    let listElement: HTMLUListElement | null = null;
    let menuElement: HTMLDivElement | null = null;
    let lastFocusedElement: HTMLElement | null = null;

    const fixed = props.positionHelperProps.isTopLayer || false;
    const quick = props.quick || false;
    let [open, setOpen] = componentProps.open;
    const hasOverflow = props.hasOverflow
    let skipRestoreFocus = componentProps.skipRestoreFocus || false;

    const menuPositionHelperProps: MenuPositionHelperProps = mergeProps(
        {
            anchorCorner: 'END_START',
            menuCorner: 'START_START',
            surfaceEl: () => menuElement,
            anchorEl: null,
            isOpen: open,
            isTopLayer: false,
            xOffset: 0,
            yOffset: 0,
            onOpen: () => {
            },
            beforeClose: async () => {
            },
            onClose: () => {
            },
        } as MenuPositionHelperProps,
        props.positionHelperProps
    )
    const menuPostionHelper = new MenuPositionHelper(menuPositionHelperProps);

    createEffect(async () => {
        const hasAnchor = !!menuPositionHelperProps.anchorEl()
        const hasSurface = !!menuPositionHelperProps.surfaceEl()
        if (open() && hasAnchor && hasSurface) {
            await menuPostionHelper.position()
        }

        if (!open() && hasAnchor && hasSurface) {
            menuPostionHelper.close()
        }
    })

    const close = () => {
        setOpen(false);
        items.forEach(item => {
            item.close?.();
        });
    }

    const handleFocusOut = (e: FocusEvent) => {
        if (componentProps.stayOpenOnFocusOut) {
            return;
        }
        // Stop propagation to prevent nested menus from interfering with each other
        e.stopPropagation();
        if (e.relatedTarget) {
            // Don't close the menu if we are switching focus between menu,
            // menu-item, and list
            if (isElementInSubtree(e.relatedTarget, this)) {
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

    return (
        <div
            class='menu__container'
            style={menuPostionHelper.containerStyles()}
        >
            <div
                {...menuProps}
                ref={menuElement!}
                class='menu-shared menu'
                classList={{
                    'menu--open': open(),
                    'menu--fixed': fixed,
                    'menu--has-overflow': hasOverflow
                }}
                style={menuPostionHelper.surfaceStyles()}
                onFocusOut={handleFocusOut}
            >
                <Elevation/>
                <List
                    ref={listElement!}
                    items={componentProps.items}
                    itemRenderer={componentProps.itemRenderer}
                    type="menu"
                />
            </div>
        </div>
    );
}
