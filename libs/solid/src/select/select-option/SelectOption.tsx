import {ListItemProps} from '../../list';
import {splitProps} from 'solid-js';
import {RequestDeselectionEvent, RequestSelectionEvent, SelectOptionItem} from '../shared';
import {MenuItem} from '../../menu';

export type SelectItemProps = {
    keepOpen?: boolean;
    data: SelectOptionItem;
} & Omit<ListItemProps, "data">

// noinspection JSValidateJSDoc
/**
 * @fires close-menu {CloseMenuEvent}
 * @fires request-selection {RequestSelectionEvent}
 * @fires request-deselection {RequestDeselectionEvent}
 */
export const SelectItem = (props: SelectItemProps) => {
    const [componentProps, selectItemProps] = splitProps(props, [
        'keepOpen',
        'data',
    ]);

    let selectItemElement: HTMLLIElement | null = null;

    const handleClick = () => {
        if (!componentProps.data.state.selected) {
            selectItemElement.dispatchEvent(
                new RequestSelectionEvent(componentProps.data)
            );
            return;
        } else {
            selectItemElement.dispatchEvent(
                new RequestDeselectionEvent(componentProps.data)
            );
        }
    };

    return (
        <MenuItem
            {...selectItemProps}
            ref={selectItemElement}
            class={'menu-item-shared'}
            classList={{
                'menu-item--selected': componentProps.data.state.selected,
            }}
            data={componentProps.data}
            onClick={handleClick}
            onFocus={componentProps.data.focus}
        />
    )
}
