import {Component, createSignal, JSX, Show, splitProps} from "solid-js";
import {createHandlers, createRippleEventEmitter, Ripple} from "../../ripple";
import {composeEventHandlers} from "../../controller";
import {focusController as fc} from '../../focus';
import './styles/outlined-icon-button-styles.css';

export type OutlinedToggleIconButtonProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    selected?: boolean
    onIcon: JSX.Element
    offIcon: JSX.Element
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export const OutlinedToggleIconButton: Component<OutlinedToggleIconButtonProps> = (props) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, buttonProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'selected',
        'onIcon',
        'offIcon',
    ]);
    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);

    const [selected, setSelected] = createSignal(props?.selected || false);

    const handleClick = () => {
        setSelected(!selected());
    };

    return (
        <button
            use:focusController={{}}
            {...buttonProps}
            {...rippleHandlers}
            onClick={
                composeEventHandlers([
                        buttonProps?.onClick,
                        rippleHandlers.onClick,
                        handleClick,
                    ]
                )
            }
            onPointerDown={
                composeEventHandlers([
                        buttonProps?.onPointerDown,
                        rippleHandlers.onPointerDown,
                    ]
                )
            }
            class={'shared-icon-button icon-button icon-button--outlined'}
            classList={{
                'icon-button--selected': selected(),
            }}
        >
            <Ripple listen={listen} unbounded={true}></Ripple>
            <span class="icon-button__touch"></span>
            <Show
                when={selected()}
                fallback={
                    <span
                        class={'icon-button__icon'}
                    >
                        {componentProps.offIcon}
                    </span>
                }
            >
                <span
                    class={'icon-button__icon icon-button__icon--selected'}
                >
                    {componentProps.onIcon}
                </span>
            </Show>
        </button>
    );
};
