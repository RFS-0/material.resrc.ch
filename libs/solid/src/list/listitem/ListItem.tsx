import {ListItemData} from '../List';
import {createEffect, JSX, onMount, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import {focusController as fc} from '../../focus';
import './styles/list-item-styles.css';
import {composeEventHandlers} from '../../controller';
import {createEventDispatcher} from '@solid-primitives/event-dispatcher';

export type ListItemProps = {
    ariaChecked?: boolean;
    ariaSelected?: boolean;
    data: ListItemData;
    end?: JSX.Element;
    nonInteractive?: boolean;
    showFocusRing?: boolean;
    start?: JSX.Element;
    onItemClicked?: (evt: CustomEvent<ListItemData>) => void;
} & JSX.HTMLAttributes<HTMLLIElement>;

export const ListItem = (props: ListItemProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const dispatch = createEventDispatcher(props);
    const [componentProps, listItemProps] = splitProps(props, [
        'ariaChecked',
        'ariaSelected',
        'data',
        'end',
        'onItemClicked',
        'nonInteractive',
        'ref',
        'showFocusRing',
        'start',
    ]);

    let listItemElement: HTMLLIElement | null = null;

    const refCallback = (el: HTMLLIElement) => {
        listItemElement = el;
        if (typeof componentProps.ref === 'function') {
            componentProps.ref(el);
        }
    }

    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

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
                listItemElement.focus();
            }
        });
    })

    const handleClick = (e: Event) => {
        e.stopPropagation();
        dispatch('itemClicked', componentProps.data);
    };

    return (
        <li
            {...listItemProps}
            ref={refCallback}
            use:focusController={{
                disabled: !componentProps.showFocusRing ||
                    componentProps.data.state.disabled ||
                    componentProps.nonInteractive,
                inward: true
            }}
            {...rippleHandlers}
            class={['list-item', props.class].join(' ')}
            classList={{
                'list-item--with-one-line': !componentProps.data.supportingText,
                'list-item--with-two-line': !!componentProps.data.supportingText && !componentProps.data.multiLineSupportingText,
                'list-item--with-three-line': !!componentProps.data.supportingText && !!componentProps.data.multiLineSupportingText,
                'list-item--disabled': componentProps.data.state.disabled,
                'list-item--noninteractive': componentProps.nonInteractive,
            }}
            onClick={
                composeEventHandlers([
                        listItemProps?.onClick,
                        rippleHandlers.onClick,
                        handleClick
                    ]
                )
            }
            aria-checked={componentProps.ariaChecked}
            aria-selected={componentProps.ariaSelected}
            id={componentProps.data.id}
            role={listItemProps.role || undefined}
            tabIndex={itemTabIndex()}
        >
            <div class="list-item__content-wrapper">
                <div class="list-item__start">
                    {componentProps.start}
                </div>
                <div class="list-item__body">
                    <span class="list-item__label-text">{componentProps.data.headline}</span>
                    <Show when={componentProps.data.supportingText !== ''}>
                        <span
                            class={'list-item__supporting-text'}
                            classList={{
                                'supporting-text--multi-line': componentProps.data.multiLineSupportingText !== '',
                            }}
                        >
                            {componentProps.data.supportingText}
                        </span>
                    </Show>
                </div>
                <div class="list-item__end">
                    <Show when={componentProps.data.trailingSupportingText !== ''}>
                        <span
                            class="list--item__trailing-supporting-text">{componentProps.data.trailingSupportingText}</span>
                    </Show>
                    <Show when={componentProps.end}>
                        {componentProps.end}
                    </Show>
                </div>
                <Ripple
                    listen={listen}
                    disabled={componentProps.nonInteractive || componentProps.data.state.disabled}
                />
            </div>
        </li>
    );
}
