import {createEffect, JSX, mergeProps, splitProps} from 'solid-js';
import {
    SurfacePositionHelper as MenuPositionHelper, SurfacePositionHelperProps as MenuPositionHelperProps
} from "./menu-position-helper";
import {Elevation} from '../elevation';
import {List, ListItemData} from '../list';
import './styles/menu-styles.css'
import {SetStoreFunction, Store} from 'solid-js/store';

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
    menuProps: Partial<MenuPositionHelperProps>;
    items: [get: Store<MenuItemData[]>, set: SetStoreFunction<MenuItemData[]>];
    itemRenderer: (item: MenuItemData) => JSX.Element;
    hasOverflow?: boolean;
    stayOpenOnOutsideClick?: boolean;
    stayOpenOnFocusOut?: boolean;
    skipRestoreFocus?: boolean;
    quick?: boolean;
    listTabIndex?: number;
    defaultFocus?: DefaultFocusState;
    showFocusRing?: boolean;
    typeaheadActive?: boolean;
};


export const Menu = (props: MenuProps) => {
    const [componentProps, menuProps] = splitProps(props, [
        'items',
        'itemRenderer',
    ]);

    const [items, setItems] = componentProps.items;

    let listElement: HTMLUListElement | null = null;
    let menuElement: HTMLDivElement | null = null;
    let lastFocusedElement: HTMLElement | null = null;

    const fixed = props.menuProps.isTopLayer
    const quick = props.quick || false;
    const open = props.menuProps.isOpen
    const hasOverflow = props.hasOverflow

    const menuPositionHelperProps: MenuPositionHelperProps = mergeProps(
        {
            anchorCorner: 'END_START',
            menuCorner: 'START_START',
            surfaceEl: () => menuElement,
            anchorEl: null,
            isOpen: false,
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
        props.menuProps
    )
    const menuPostionHelper = new MenuPositionHelper(menuPositionHelperProps);

    const onOpen = () => {
    }

    const beforeClose = () => {
    }

    const onClose = () => {
    }

    createEffect(async () => {
        const hasAnchor = !!menuPositionHelperProps.anchorEl()
        const hasSurface = !!menuPositionHelperProps.surfaceEl()
        if (props.menuProps.isOpen && hasAnchor && hasSurface) {
            await menuPostionHelper.position()
            onOpen()
        }

        if (!props.menuProps.isOpen && hasAnchor && hasSurface) {
            beforeClose()
            menuPostionHelper.close()
            onClose()
        }
    })

    return (
        <div
            class='menu__container'
            style={menuPostionHelper.containerStyles()}
        >
            <div
                ref={menuElement!}
                class='menu-shared menu'
                classList={{
                    'menu--open': open,
                    'menu--fixed': fixed,
                    'menu--has-overflow': hasOverflow
                }}
                style={menuPostionHelper.surfaceStyles()}
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
