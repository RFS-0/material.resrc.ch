import './styles/filled-select-styles.css'
import {createSignal, JSX, Signal, splitProps} from 'solid-js';
import {
    isElementInSubtree, Menu, selectItem as selectMenuItem, TYPEAHEAD_RECORD, TypeaheadController,
    unselectItem as unselectMenuItem
} from '../menu';
import {FilledField} from '../field';
import {SetStoreFunction, Store} from 'solid-js/store';
import {
    getSelectedItems, RequestDeselectionEvent, RequestSelectionEvent, SelectOptionItem, SelectOptionRecord
} from './shared';
import {activateItem, deactivateItem, getActiveItem, ListItemData} from '../list';

export type FilledSelectProps = {
    disabled?: boolean
    error?: boolean
    items: [get: Store<SelectOptionItem[]>, set: SetStoreFunction<SelectOptionItem[]>];
    itemRenderer: (item: SelectOptionItem) => JSX.Element;
    label: string
    leadingIcon?: JSX.Element
    open?: Signal<boolean>
    quick?: boolean;
    resizable?: boolean
    required?: boolean
    supportingTextEnd?: string
    supportingTextStart?: string
    trailingIcon?: JSX.Element
    typeaheadDelay?: number;
}

export const FilledSelect = (props: FilledSelectProps) => {
    const [componentProps, ,] = splitProps(props, [
        'disabled',
        'error',
        'itemRenderer',
        'items',
        'label',
        'leadingIcon',
        'open',
        'quick',
        'resizable',
        'required',
        'supportingTextEnd',
        'supportingTextStart',
        'trailingIcon',
        'typeaheadDelay',
    ]);

    let selectElement: HTMLDivElement | null = null;
    let fieldElement: HTMLDivElement | null = null;
    let menuElement: HTMLDivElement | null = null;

    const [typeaheadActive, ] = createSignal(false);
    const [typeaheadDelay,] = createSignal(500);
    const typeaheadController = new TypeaheadController({
        active: typeaheadActive,
        items: componentProps.items,
        typeaheadBufferTime: typeaheadDelay
    })

    const [open, setOpen] = componentProps.open || createSignal(false);
    const [focused, setFocused] = createSignal(false);
    const [value, setValue] = createSignal('');

    const [menuItems,] = componentProps.items;
    let lastSelectedOptionRecords: SelectOptionRecord[] = [];
    let lastSelectedOption: SelectOptionItem | null = null;

    const getSelectedOptions = () => {
        if (!menuElement) {
            lastSelectedOptionRecords = [];
            return null;
        }

        const items = menuItems as SelectOptionItem[];
        lastSelectedOptionRecords = getSelectedItems(items);
        return lastSelectedOptionRecords;
    }

    const updateValue = () => {
        const selectedOptions = getSelectedOptions() ?? [];
        // Used to determine whether or not we need to fire an input / change event
        // which fire whenever the option element changes (value or selectedIndex)
        // on user interaction.
        let hasSelectedOptionChanged: boolean;

        if (selectedOptions.length) {
            const [firstSelectedOption] = selectedOptions[0];
            hasSelectedOptionChanged = lastSelectedOption !== firstSelectedOption;
            lastSelectedOption = firstSelectedOption;
            setValue(firstSelectedOption.value);
        } else {
            hasSelectedOptionChanged = lastSelectedOption !== null;
            lastSelectedOption = null;
            setValue('');
        }

        return hasSelectedOptionChanged;
    }

    let handleFocusOut = (e: FocusEvent) => {
        // Don't close the menu if we are switching focus between menu,
        // select-option, and field
        if (e.relatedTarget && isElementInSubtree(e.relatedTarget, this)) {
            return;
        }
        setOpen(false);
    };

    const selectItem = (item: SelectOptionItem) => {
        lastSelectedOptionRecords.forEach(([option]) => {
            if (item !== option) {
                unselectMenuItem(option, componentProps.items)
            }
        });
        selectMenuItem(item, componentProps.items);

        return updateValue();
    }

    const unselectItem = (item: SelectOptionItem) => {
        unselectMenuItem(item, componentProps.items);
        return updateValue();
    }

    const dispatchInteractionEvents = () => {
        selectElement.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
        selectElement.dispatchEvent(new Event('change', {bubbles: true}));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (open() || componentProps.disabled || !menuElement) {
            return;
        }

        const isOpenKey = e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'Enter';

        // Do not open if currently typing ahead because the user may be typing the
        // spacebar to match a word with a space
        if (!typeaheadController.isTypingAhead && isOpenKey) {
            e.preventDefault();
            setOpen(true);
            return;
        }

        const isPrintableKey = e.key.length === 1;

        // Handles typing ahead when the menu is closed by delegating the event to
        // the underlying menu's typeaheadController
        if (isPrintableKey) {
            typeaheadController.onKeydown(e);
            e.preventDefault();

            const {lastActiveRecord} = typeaheadController;

            if (!lastActiveRecord) {
                return;
            }

            const hasChanged = selectItem(lastActiveRecord[TYPEAHEAD_RECORD.ITEM] as SelectOptionItem);

            if (hasChanged) {
                dispatchInteractionEvents();
            }
        }
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleFocus = () => {
        setFocused(true);
    }

    const handleBlur = () => {
        setFocused(false);
    }

    const handleOpening = async () => {
        const items = menuItems as ListItemData[];
        const activeItem = getActiveItem(items)?.item;
        const [selectedItem] = lastSelectedOptionRecords[0] ?? [null];

        // This is true if the user keys through the list but clicks out of the menu
        // thus no close-menu event is fired by an item and we can't clean up in
        // handleCloseMenu.
        if (activeItem && activeItem !== selectedItem) {
            deactivateItem(activeItem, componentProps.items);
        }

        if (selectedItem) {
            activateItem(selectedItem, componentProps.items);
            selectedItem.focus && selectedItem.focus();
        }
    }

    const handleClosing = () => {
        setOpen(false);
    }


    const handleSelection = (e: RequestSelectionEvent) => {
        selectItem(e.selectedOption);
    }

    const handleDeselection = (e: RequestDeselectionEvent) => {
        unselectItem(e.deselectedOption);
    }

    return (
        <span
            ref={selectElement}
            class="select__container"
            classList={{
                'select--disabled': componentProps.disabled,
            }}
            onfocusout={handleFocusOut}
        >
            <FilledField
                ref={fieldElement}
                aria-haspopup="listbox"
                role="combobox"
                tabindex={componentProps.disabled ? '-1' : '0'}
                aria-expanded={open() ? 'true' : 'false'}
                class={'select__field'}
                disabled={componentProps.disabled}
                error={componentProps.error}
                focused={focused() || open()}
                label={componentProps.label}
                leadingIcon={componentProps.leadingIcon}
                resizable={componentProps.resizable}
                required={componentProps.required}
                supportingTextEnd={componentProps.supportingTextEnd}
                supportingTextStart={componentProps.supportingTextStart}
                trailingIcon={componentProps.trailingIcon}
                value={value}
                onKeyDown={handleKeyDown}
                onClick={handleClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <Menu
                ref={menuElement}
                defaultFocus={'NONE'}
                open={[open, setOpen]}
                listTabIndex={-1}
                type={'list'}
                stayOpenOnFocusout={true}
                positionHelper={{
                    anchorEl: () => fieldElement,
                    isOpen: open,
                    isTopLayer: false,
                }}
                quick={componentProps.quick}
                typeAheadController={typeaheadController}
                items={componentProps.items}
                itemRenderer={componentProps.itemRenderer}
                onOpening={handleOpening}
                onClosing={handleClosing}
                on:request-selection={handleSelection}
                on:request-deselection={handleDeselection}
            />
        </span>
    )
}
