import {createEffect, createSignal, JSX, onMount, splitProps} from 'solid-js'
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple'
import './styles/checkbox-styles.css'
import {FocusRing} from '../focus';
import {composeEventHandlers} from '../controller';
import {createStore} from 'solid-js/store';

export type CheckboxProps = {
    ariaHasPopup?: boolean
    ariaLabel?: string
    checked?: boolean
    disabled?: boolean
    error?: boolean
    form?: HTMLFormElement
    indeterminate?: boolean
    name?: string;
    showFocusRing?: boolean;
    value?: string;
} & JSX.HTMLAttributes<HTMLInputElement>


type StateChange = {
    checkBox: {
        isChecked: boolean,
        isDisabled: boolean,
        isError: boolean,
        isIndeterminate: boolean,
        wasChecked: boolean,
        wasDisabled: boolean,
        wasError: boolean,
        wasIndeterminate: boolean,
    }
}

export const Checkbox = (props: CheckboxProps) => {
    const [componentProps, checkBoxProps] = splitProps(props, [
        'checked',
        'disabled',
        'error',
        'form',
        'indeterminate',
        'name',
        'showFocusRing',
        'value',
    ]);

    let checkbox: HTMLInputElement | null

    const [state, setState] = createStore<StateChange>({
        checkBox: {
            isChecked: componentProps?.checked || false,
            isDisabled: componentProps?.disabled || false,
            isError: componentProps?.error || false,
            isIndeterminate: componentProps?.indeterminate || false,
            wasChecked: false,
            wasDisabled: false,
            wasError: false,
            wasIndeterminate: false,
        },
    })

    const [focus, setFocus] = createSignal(componentProps?.showFocusRing);
    const {listen, emit} = createRippleEventEmitter()
    const rippleHandlers = createHandlers(emit);

    const ariaCheckedValue = () => {
        if (state.checkBox.isIndeterminate) return 'mixed'
        if (state.checkBox.isChecked) return 'true'
        return 'false'
    }

    const handlePointerDown = (e: PointerEvent) => {
        emit({type: 'pointerdown', pointerEvent: (e)});
    }

    const handleClick = (e: MouseEvent) => {
        emit({type: 'click', pointerEvent: (e)});
    }

    const activateFocus = () => {
        if (!componentProps?.showFocusRing) {
            return;
        }
        setFocus(true);
    };

    const deactivateFocus = () => {
        if (!componentProps?.showFocusRing) {
            return;
        }
        setFocus(false);
    };

    const handleChange = (event: Event) => {
        const target = event.target as HTMLInputElement
        setState(
            "checkBox",
            (prev) => (
                {
                    wasChecked: prev.isChecked,
                    isChecked: target.checked,
                    wasDisabled: prev.isDisabled,
                    isDisabled: target.disabled,
                    wasIndeterminate: prev.isIndeterminate,
                    isIndeterminate: target.indeterminate,
                }
            )
        );
    }

    onMount(() => {
        createEffect(() => {
            checkbox.indeterminate = state.checkBox.isIndeterminate
        })
    });

    return (
        <div class='base-checkbox'>
            <div
                class={'checkbox-container'}
                classList={{
                    'checkbox-selected': state.checkBox.isChecked || state.checkBox.isIndeterminate,
                    'checkbox-unselected': !state.checkBox.isChecked && !state.checkBox.isIndeterminate,
                    'checkbox-checked': state.checkBox.isChecked,
                    'checkbox-indeterminate': state.checkBox.isIndeterminate,
                    'checkbox-error': state.checkBox.isError && !props?.disabled,
                    'checkbox-prev-unselected': !state.checkBox.wasChecked && !state.checkBox.wasIndeterminate,
                    'checkbox-prev-checked': state.checkBox.wasChecked && !state.checkBox.wasIndeterminate,
                    'checkbox-prev-indeterminate': state.checkBox.wasIndeterminate,
                    'checkbox-prev-disabled': state.checkBox.wasDisabled,
                }}
            >
                <div class="checkbox-outline"></div>
                <div class="checkbox-background"></div>
                <FocusRing visible={focus()}></FocusRing>
                <Ripple listen={listen} unbounded={true}></Ripple>
                <svg class="checkbox-icon" viewBox="0 0 18 18">
                    <rect class="checkbox-mark checkbox-short"/>
                    <rect class="checkbox-mark checkbox-long"/>
                </svg>
            </div>
            <input
                {...checkBoxProps}
                {...rippleHandlers}
                aria-checked={ariaCheckedValue()}
                aria-label={`${props?.ariaLabel || ''}`}
                checked={state.checkBox.isChecked}
                disabled={state.checkBox.isDisabled}
                onBlur={composeEventHandlers([checkBoxProps?.onblur, deactivateFocus])}
                onChange={composeEventHandlers([checkBoxProps?.onchange, handleChange])}
                onClick={composeEventHandlers([
                    checkBoxProps?.onclick,
                    rippleHandlers.onClick,
                    handleClick
                ])}
                onFocus={composeEventHandlers([checkBoxProps?.onfocus, activateFocus])}
                onPointerDown={composeEventHandlers([
                    checkBoxProps?.onpointerdown,
                    rippleHandlers.onPointerDown,
                    handlePointerDown
                ])}
                ref={checkbox!}
                type="checkbox"
            ></input>
        </div>
    )
}
