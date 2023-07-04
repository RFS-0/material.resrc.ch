import {ListItem, ListItemProps} from '../../list';
import {splitProps} from 'solid-js';
import {ClickReason, CLOSE_REASON, CloseMenuEvent, isClosableKey, KeydownReason} from '../shared';
import {MenuItemData} from '../Menu';
import './styles/menu-item-styles.css'
import {composeEventHandlers} from '../../controller';

export type MenuItemProps = {
    keepOpen?: boolean;
    data: MenuItemData;
} & Omit<ListItemProps, "data">

// noinspection JSValidateJSDoc
/**
 * @fires close-menu {CloseMenuEvent}
 */
export const MenuItem = (props: MenuItemProps) => {
    const [componentProps, menuItemProps] = splitProps(props, [
        'keepOpen',
        'data',
        'ref',
    ]);

    let menuItem: HTMLLIElement | null = null;

    const refCallback = (el: HTMLLIElement) => {
        menuItem = el;
        if (typeof componentProps.ref === 'function') {
            componentProps.ref(el);
        }
    }

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
            menuItem.dispatchEvent(
                new CloseMenuEvent<KeydownReason>(
                    componentProps.data,
                    {kind: CLOSE_REASON.KEYDOWN, key: keyCode}
                )
            )
        }
    }

    return (
        <ListItem
            {...menuItemProps}
            ref={refCallback}
            class={'menu-item-shared'}
            classList={{
                'menu-item--selected': componentProps.data.state.selected,
            }}
            data={componentProps.data}
            onClick={
                composeEventHandlers(
                    [
                        props.onClick,
                        handleClick
                    ]
                )
            }
            onKeyDown={
                composeEventHandlers([
                        props.onKeyDown,
                        handleKeydown
                    ]
                )
            }
            onFocus={
                composeEventHandlers([
                        props.onFocus,
                        componentProps.data.focus
                    ]
                )
            }
        />
    )
}
