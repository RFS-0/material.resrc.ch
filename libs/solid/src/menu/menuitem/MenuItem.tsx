import {ListItem, ListItemProps} from '../../list';
import {splitProps} from 'solid-js';
import {ClickReason, CLOSE_REASON, CloseMenuEvent, isClosableKey, KeydownReason} from '../shared';
import {createEventDispatcher} from '@solid-primitives/event-dispatcher';
import {MenuItemData} from '../Menu';
import './styles/menu-item-styles.css'

export type MenuItemProps = {
    keepOpen?: boolean;
    onCloseMenu?: (evt: CloseMenuEvent) => void;
    data: MenuItemData;
} & Omit<ListItemProps, "data">

export const MenuItem = (props: MenuItemProps) => {
    const dispatch = createEventDispatcher(props);
    const [componentProps, menuItemProps] = splitProps(props, [
        'keepOpen',
        'data',
    ]);

    const handleClick = () => {
        if (componentProps.keepOpen) {
            return;
        }

        dispatch(
            'closeMenu',
            new CloseMenuEvent<ClickReason>(componentProps.data, {kind: CLOSE_REASON.CLICK_SELECTION})
        )
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (componentProps.keepOpen) {
            return;
        }

        const keyCode = e.code;

        if (!e.defaultPrevented && isClosableKey(keyCode)) {
            dispatch(
                'closeMenu',
                new CloseMenuEvent<KeydownReason>(componentProps.data, {kind: CLOSE_REASON.KEYDOWN, key: keyCode})
            )
        }
    }

    return (
        <ListItem
            data-menu-item
            {...menuItemProps}
            class={'menu-item-shared'}
            classList={{
                'menu-item--selected': componentProps.data.state.selected,
            }}
            data={componentProps.data}
            onClick={handleClick}
            onKeyDown={handleKeydown}
            onFocus={componentProps.data.focus}
        />
    )
}
