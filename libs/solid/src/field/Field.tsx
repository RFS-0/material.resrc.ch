import {
    Accessor, Component, createEffect, createMemo, createSignal, JSX, onMount, ParentProps, Show, splitProps
} from "solid-js"
import {createAnimationSignal} from "../motion"
import {getLabelKeyframes} from "./label-animations"
import './styles/outlined-styles.css'
import './styles/filled-styles.css'

export type StateChange = { wasFocused: boolean, isFocused: boolean, wasPopulated: boolean, isPopulated: boolean }

export type FieldProps = {
    disabled?: boolean;
    error?: boolean;
    focused?: boolean;
    hasLeadingIcon?: boolean;
    hasTrailingIcon?: boolean;
    label?: string;
    leadingIcon?: JSX.Element;
    populated?: boolean;
    resizable?: boolean;
    required?: boolean;
    supportingTextEnd?: JSX.Element;
    supportingTextStart?: JSX.Element;
    trailingIcon?: JSX.Element;
    variant?: 'filled' | 'outlined';
} & JSX.HTMLAttributes<HTMLDivElement> & ParentProps

export const Field: Component<FieldProps> = (props) => {
    const [componentProps, fieldProps,] = splitProps(props, [
        'children',
        'disabled',
        'error',
        'focused',
        'hasLeadingIcon',
        'hasTrailingIcon',
        'label',
        'leadingIcon',
        'populated',
        'required',
        'resizable',
        'supportingTextEnd',
        'supportingTextStart',
        'trailingIcon',
        'variant',
    ]);

    let restingLabel: HTMLDivElement | null = null;
    let floatingLabel: HTMLDivElement | null = null;
    let container: HTMLDivElement | null = null;

    const populated = createMemo(() => componentProps.populated)
    const focused = createMemo(() => componentProps.focused || false)
    const [animating, setAnimating] = createSignal(false)
    const [labelState, setLabelState] = createSignal<'floating' | 'resting' | 'no-label'>('resting');

    createEffect(() => {
        if (focused() || populated() || animating()) {
            setLabelState('floating');
        } else if (!focused() && !populated() && !animating()) {
            setLabelState('resting');
        } else {
            setLabelState('no-label');
        }
    })

    const fieldState: Accessor<StateChange> = createMemo(
        (prev: StateChange) => {
            return {
                wasFocused: prev.isFocused,
                isFocused: focused(),
                wasPopulated: prev.isPopulated,
                isPopulated: populated(),
            }
        },
        {
            wasFocused: false,
            isFocused: focused(),
            wasPopulated: false,
            isPopulated: !populated(),
        }
    )
    const labelAnimationSignal = createAnimationSignal()

    const getLabelText = () => {
        const labelText = componentProps?.label || '';
        const optionalAsterisk = componentProps?.required && labelText ? '*' : '';
        return labelText + optionalAsterisk;
    }

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
            {...fieldProps}
            class={'field-shared field'}
            classList={{
                'filled-field': componentProps.variant === 'filled',
                'outlined-field': componentProps.variant === 'outlined',
                'field--disabled': componentProps.disabled,
                'field--error': componentProps.error && !componentProps.disabled,
                'field--focused': focused(),
                'field--with-start': componentProps.hasLeadingIcon,
                'field--with-end': componentProps.hasTrailingIcon,
                'field--populated': populated(),
                'field--resizable': componentProps.resizable,
                'field--required': componentProps.required,
                'field--no-label': !componentProps.label,
            }}
        >
            <div class="field__container-overflow">
                <Show
                    when={componentProps.variant === 'outlined'}
                    fallback={
                        <>
                            <div class="filled-field__background"></div>
                            <div class="filled-field__state-layer"></div>
                            <div class="filled-field__active-indicator"></div>
                        </>
                    }
                >
                    <div class={'field__outline'}>
                        <div class={"field__outline-start"}></div>
                        <div class={"field__outline-notch"}>
                            <div class={"field__outline-panel-inactive"}></div>
                            <div class={"field__outline-panel-active"}></div>
                            <div class="field__outline-label">
                        <span
                            ref={floatingLabel}
                            class={'field__label field__label--floating'}
                            classList={{
                                'field__label--hidden': labelState() !== 'floating',
                            }}
                        >
                                {getLabelText()}
                        </span>
                            </div>
                        </div>
                        <div class={"field__outline-end"}></div>
                    </div>
                </Show>
                <div
                    ref={container}
                    class={'field__container'}
                >
                    <div class={'field__start'}>
                        <Show when={componentProps.hasLeadingIcon}>
                            {componentProps?.leadingIcon}
                        </Show>
                    </div>
                    <div class={`field__middle`}>
                        <span
                            ref={restingLabel}
                            class={'field__label field__label--resting'}
                            classList={{
                                'field__label--hidden': labelState() !== 'resting',
                            }}
                        >
                                {getLabelText()}
                        </span>
                        <Show when={componentProps.variant === 'filled'}>
                            <span
                                ref={floatingLabel!}
                                class={'field__label field__label--floating'}
                                classList={{
                                    'field__label--hidden': labelState() !== 'floating',
                                }}
                            >
                                {getLabelText()}
                        </span>
                        </Show>
                        <div class={'field__content'}>
                            <Show
                                when={populated()}
                                fallback={<span>&nbsp;</span>}
                            >
                                {componentProps.children}
                            </Show>
                        </div>
                    </div>
                    <div class={`field__end`}>
                        <Show when={componentProps.hasTrailingIcon}>
                            {componentProps?.trailingIcon}
                        </Show>
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
