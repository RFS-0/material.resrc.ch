import {ListItemData} from '../List';
import {createEffect, JSX, onMount, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import {focusController as fc} from '../../focus';
import './styles/list-item-styles.css';

export type ListItemProps = {
    ariaChecked?: boolean;
    ariaSelected?: boolean;
    data: ListItemData;
    showFocusRing?: boolean;
    start?: JSX.Element;
} & JSX.HTMLAttributes<HTMLLIElement>;

export const ListItem = (props: ListItemProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, listItemProps] = splitProps(props, [
        'ariaChecked',
        'ariaSelected',
        'data',
        'showFocusRing',
        'start',
    ]);

    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);

    let listItemElement: HTMLLIElement | null = null;

    const itemTabIndex = () => {
        if (componentProps.data.state.active) {
            return 0;
        }
        return -1;
    }

    onMount(() => {
        createEffect(() => {
            if (!componentProps.data.state.disabled &&
                componentProps.data.state.focusOnActivation &&
                componentProps.data.state.active) {
                listItemElement?.focus();
            }
        });
    })

    return (
        <li
            ref={listItemElement}
            use:focusController={{
                disabled: !componentProps.showFocusRing,
            }}
            {...rippleHandlers}
            {...listItemProps}
            class={'list-item'}
            classList={{
                'with-one-line': componentProps.data.supportingText === '',
                'with-two-line': componentProps.data.supportingText !== '' && !componentProps.data.multiLineSupportingText,
                'with-three-line': componentProps.data.supportingText !== '' && componentProps.data.multiLineSupportingText !== '',
                'disabled': componentProps.data.state.disabled,
            }}
            aria-checked={componentProps.ariaChecked}
            aria-selected={componentProps.ariaSelected}
            id={componentProps.data.id}
            role={listItemProps.role || undefined}
            tabIndex={itemTabIndex()}
        >
            <div class="content-wrapper">
                <div class="start">
                    {componentProps.start}
                </div>
                <div class="body">
                    <span class="label-text">{componentProps.data.headline}</span>
                    <Show when={componentProps.data.supportingText !== ''}>
                        <span
                            class={'supporting-text'}
                            classList={{
                                'supporting-text--multi-line': componentProps.data.multiLineSupportingText !== '',
                            }}
                        >
                            {componentProps.data.supportingText}
                        </span>
                    </Show>
                </div>
                <div class="end">
                    <Show when={componentProps.data.trailingSupportingText !== ''}>
                        <span class="trailing-supporting-text">{componentProps.data.trailingSupportingText}</span>
                    </Show>
                </div>
                <Ripple listen={listen} disabled={componentProps.data.state.disabled} unbounded={true}></Ripple>
            </div>
        </li>
    );
}
