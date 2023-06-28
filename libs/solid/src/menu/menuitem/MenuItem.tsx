import {ListItem, ListItemProps} from '../../list';
import {splitProps} from 'solid-js';
import {ClickReason, CLOSE_REASON, CloseMenuEvent, isClosableKey, KeydownReason} from '../shared';
import {MenuItemData} from '../Menu';
import './styles/menu-item-styles.css'

export type MenuItemProps = {
    keepOpen?: boolean;
    data: MenuItemData;
} & Omit<ListItemProps, "data">

export const MenuItem = (props: MenuItemProps) => {
    const [componentProps, menuItemProps] = splitProps(props, [
        'keepOpen',
        'data',
    ]);

    let menuItem: HTMLLIElement | null = null;

    const handleClick = () => {
        if (componentProps.keepOpen) {
            return;
        }

        menuItem.dispatchEvent(
            new CloseMenuEvent<ClickReason>(
                componentProps.data,
                {kind: CLOSE_REASON.CLICK_SELECTION}
            )
        );
    }

    const handleKeydown = (e: KeyboardEvent) => {
        if (componentProps.keepOpen) {
            return;
        }

        const keyCode = e.code;

        if (!e.defaultPrevented && isClosableKey(keyCode)) {
            menuItem.dispatchEvent(new CloseMenuEvent<KeydownReason>(
                    componentProps.data,
                    {kind: CLOSE_REASON.KEYDOWN, key: keyCode}
                )
            )
        }
    }

    return (
        <ListItem
            {...menuItemProps}
            ref={(el) => (menuItem = el)}
            data-menu-item
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
