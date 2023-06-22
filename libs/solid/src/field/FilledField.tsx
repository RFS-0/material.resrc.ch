import {Component, createEffect, createMemo, createSignal, JSX, onMount, splitProps, VoidProps} from "solid-js"
import './styles/filled-styles.css'
import {createAnimationSignal} from "../motion"
import {getLabelKeyframes} from "./label-animations"

export type FilledFieldProps = {
    disabled?: boolean
    error?: boolean
    focused?: boolean
    label?: string
    leadingIcon?: JSX.Element
    populated?: boolean
    resizable?: boolean
    required?: boolean
    supportingTextEnd?: string
    supportingTextStart?: string
    trailingIcon?: JSX.Element
    value?: string
} & VoidProps

type StateChange = { wasFocused: boolean, isFocused: boolean, wasPopulated: boolean, isPopulated: boolean }

export const FilledField: Component<FilledFieldProps> = (props) => {
    const [componentProps,] = splitProps(props, [
        'disabled',
        'error',
        'focused',
        'label',
        'leadingIcon',
        'populated',
        'required',
        'resizable',
        'supportingTextEnd',
        'supportingTextStart',
        'trailingIcon',
        'value',
    ]);

    let restingLabel: HTMLDivElement | null = null;
    let floatingLabel: HTMLDivElement | null = null;
    let container: HTMLDivElement | null = null;

    const fieldState = createMemo(
        (prev: StateChange) => {
            return {
                wasFocused: prev.isFocused,
                isFocused: !!componentProps?.focused,
                wasPopulated: prev.isPopulated,
                isPopulated: !!componentProps?.populated
            }
        },
        {
            wasFocused: false,
            isFocused: !!componentProps?.populated,
            wasPopulated: false,
            isPopulated: !!componentProps?.populated
        }
    )
    const labelAnimationSignal = createAnimationSignal()

    const getLabelText = () => {
        const labelText = componentProps?.label || '';
        const optionalAsterisk = componentProps?.required && labelText ? '*' : '';
        return labelText + optionalAsterisk;
    }

    const showFloatingLabel = () => {
        // Floating label is visible when focused/populated or when animating.
        return componentProps.focused || componentProps.populated || animating();

    }
    const showRestingLabel = () => {
        // Resting label is visible when unfocused. It is never visible while
        // animating.
        return !componentProps.focused && !componentProps.populated && !animating();
    }

    const [animating, setAnimating] = createSignal(false)

    onMount(() => {
        createEffect(() => {
            const state = fieldState()
            const wasFloating = state.wasFocused || state.wasPopulated;
            const shouldBeFloating = state.isFocused || state.isPopulated;
            if (wasFloating === shouldBeFloating) {
                return;
            }
            const signal = labelAnimationSignal.start();
            const keyframes = getLabelKeyframes(floatingLabel, restingLabel, state.isFocused || state.isPopulated ? 'restToFloat' : 'floatToRest')

            if (signal.aborted) {
                return;
            }

            setAnimating(true)
            const animation = restingLabel.animate(keyframes, {duration: 150, easing: 'cubic-bezier(0.2, 0, 0, 1)'});

            signal.addEventListener('abort', () => {
                animation.cancel();
                setAnimating(false)
            });

            animation.addEventListener('finish', () => {
                // At the end of the animation, update the visible label.
                labelAnimationSignal.finish();
                setAnimating(false)
            });
        })
    })

    return (
        <div
            class={'field-shared field filled-field'}
            classList={{
                'field--disabled': componentProps.disabled,
                'field--error': componentProps.error && !componentProps.disabled,
                'field--focused': componentProps.focused,
                'field--with-start': !!componentProps.leadingIcon,
                'field--with-end': !!componentProps.trailingIcon,
                'field--populated': componentProps.populated,
                'field--resizable': componentProps.resizable,
                'field--required': componentProps.required,
                'field--no-label': !componentProps.label,
            }}
        >
            <div class="field__container-overflow">
                <div class="filled-field__background"></div>
                <div class="filled-field__state-layer"></div>
                <div class="filled-field__active-indicator"></div>
                <div
                    ref={container!}
                    class={'field__container'}
                >
                    <div class={'field__start'}>
                        {componentProps?.leadingIcon}
                    </div>
                    <div class={'field__middle'}>
                        <span
                            ref={restingLabel!}
                            class={'field__label field__label--resting'}
                            classList={{
                                'field__label--hidden': !showRestingLabel(),
                            }}
                        >
                                {getLabelText()}
                        </span>
                        <span
                            ref={floatingLabel!}
                            class={'field__label field__label--floating'}
                            classList={{
                                'field__label--hidden': !showFloatingLabel(),
                            }}
                        >
                                {getLabelText()}
                        </span>
                        <div class={'field__content'}>
                            {componentProps.value || 'placeholder'}
                        </div>
                    </div>
                    <div class={`field__end`}>
                        {componentProps?.trailingIcon}
                    </div>
                </div>
            </div>
            <div class="field__supporting-text">
                <div class="field__supporting-text-start">
                    <div>{componentProps?.supportingTextStart}</div>
                </div>
                <div class="field__supporting-text-end">
                    <div>{componentProps?.supportingTextEnd}</div>
                </div>
            </div>
        </div>
    )
}
