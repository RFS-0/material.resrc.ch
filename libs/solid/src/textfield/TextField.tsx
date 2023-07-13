import {Component, createMemo, createSignal, JSX, ParentProps, Show, Signal, splitProps} from 'solid-js';
import {Field} from '../field';
import './styles/outlined-textfield-styles.css';
import './styles/filled-textfield-styles.css';
import {redispatchEvent} from '../controller';

export type TextFieldType = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
export type UnsupportedTextFieldType = 'color' | 'date' | 'datetime-local' | 'file' | 'month' | 'time' | 'week';
export type InvalidTextFieldType = 'button' | 'checkbox' | 'hidden' | 'image' | 'radio' | 'range' | 'reset' | 'submit';

export type TextFieldProps = {
    disabled?: boolean;
    error?: boolean;
    errorText?: string;
    focused?: boolean;
    label?: string;
    leadingIcon?: JSX.Element;
    max?: number;
    maxLength?: number;
    min?: number;
    minLength?: number;
    pattern?: string;
    placeholder?: string;
    prefixText?: string;
    readOnly?: boolean;
    resizable?: boolean;
    required?: boolean;
    suffixText?: string;
    supportingText?: string;
    step?: number;
    trailingIcon?: JSX.Element;
    type: TextFieldType | UnsupportedTextFieldType;
    value?: Signal<string>;
    variant?: 'filled' | 'outlined';
} & ParentProps

type FieldState = {
    dirty: boolean;
    disabled: boolean;
    error: boolean;
    errorText: string;
    focused: boolean;
    maxLength: number;
    nativeError: boolean;
    nativeErrorText: string;
    refreshErrorAlert: boolean;
    supportingText: string;
}

export const TextField: Component<TextFieldProps> = (props) => {
    const [componentProps, ,] = splitProps(props, [
        'children',
        'disabled',
        'error',
        'errorText',
        'focused',
        'label',
        'leadingIcon',
        'max',
        'maxLength',
        'min',
        'minLength',
        'pattern',
        'placeholder',
        'prefixText',
        'readOnly',
        'required',
        'resizable',
        'suffixText',
        'supportingText',
        'step',
        'trailingIcon',
        'type',
        'value',
        'variant',
    ]);

    const [value, setValue] = componentProps.value || createSignal('');

    let inputElement: HTMLInputElement | null = null;
    let textFieldElement: HTMLElement | null = null;

    const [fieldState, setFieldState] = createSignal<FieldState>({
        dirty: false,
        disabled: componentProps.disabled || false,
        error: componentProps.error || false,
        errorText: componentProps.errorText || '',
        focused: componentProps.focused || false,
        maxLength: componentProps.maxLength || -1,
        refreshErrorAlert: false,
        nativeError: false,
        nativeErrorText: '',
        supportingText: componentProps.supportingText || '',
    })

    const focused = createMemo(() => {
        return fieldState().focused;
    });

    const hasError = createMemo(() => {
        return componentProps.error || fieldState().nativeError;
    })

    const handleInput = (event: InputEvent) => {
        setFieldState({
            ...fieldState(),
            dirty: true,
        });
        setValue((event.target as HTMLInputElement).value);
        redispatch(event);
    }

    const redispatch = (event: Event) => {
        redispatchEvent(textFieldElement, event)
    }

    const getErrorText = createMemo(() => {
        return fieldState().error ? fieldState().errorText : fieldState().nativeErrorText;
    });

    const shouldErrorAnnounce = createMemo(() => {
        // Announce if there is an error and error text visible.
        // If refreshErrorAlert is true, do not announce. This will remove the
        // role="alert" attribute. Another render cycle will happen after an
        // animation frame to re-add the role.
        return hasError() && !!getErrorText() && !fieldState().refreshErrorAlert;
    });

    const getSupportingText = createMemo(() => {
        const errorText = getErrorText();
        return hasError() && errorText ? errorText : fieldState().supportingText;
    });

    const getCounterText = createMemo(() => {
        return fieldState().maxLength > 0 ? `${value().length} / ${fieldState().maxLength}` : '';
    });

    const focus = () => {
        if (fieldState().disabled || inputElement && inputElement.matches(':focus-within')) {
            return;
        }
        setFieldState({
            ...fieldState(),
            focused: true,
        });
        inputElement.focus();
    };

    const handleFocusIn = () => {
        setFieldState({
            ...fieldState(),
            focused: true,
        });
    }

    const handleFocusOut = () => {
        if (inputElement && inputElement.matches(':focus-within')) {
            return;
        }
        setFieldState({
            ...fieldState(),
            focused: false,
        });
    };

    return (
        <span
            ref={textFieldElement}
            class={'text-field__wrapper'}
            onClick={focus}
            onFocusIn={handleFocusIn}
            onFocusOut={handleFocusOut}
        >
            <span
                class={'text-field'}
                classList={{
                    'disabled': componentProps.disabled,
                    'error': !componentProps.disabled && hasError(),
                }}
            >
                <Field
                    disabled={componentProps.disabled}
                    error={componentProps.error}
                    focused={focused()}
                    label={componentProps.label}
                    leadingIcon={
                        <span class="icon leading">
                            {componentProps.leadingIcon}
                        </span>
                    }
                    populated={value() !== '' || focused()}
                    required={componentProps.required}
                    resizable={componentProps.resizable}
                    supportingTextEnd={
                        <Show when={!!getCounterText()}>
                            <span class={'counter'}>
                                {getCounterText()}
                            </span>
                        </Show>
                    }
                    supportingTextStart={
                        <Show when={!!getSupportingText()}>
                            <span
                                role={shouldErrorAnnounce() ? 'alert' : undefined}
                            >
                                {getSupportingText()}
                            </span>
                        </Show>
                    }
                    trailingIcon={
                        <span class="icon trailing">
                            {componentProps.trailingIcon}
                        </span>
                    }
                    variant={componentProps.variant}
                >
                    <span class={'prefix'}>{componentProps.prefixText}</span>
                    <input
                        ref={inputElement}
                        disabled={componentProps.disabled}
                        max={componentProps.max > 0 ? componentProps.max : undefined}
                        maxLength={componentProps.maxLength > 0 ? componentProps.maxLength : undefined}
                        min={componentProps.min > 0 ? componentProps.min : undefined}
                        minLength={componentProps.minLength > 0 ? componentProps.minLength : undefined}
                        pattern={componentProps.pattern || undefined}
                        placeholder={componentProps.placeholder || undefined}
                        readOnly={componentProps.readOnly}
                        required={componentProps.required}
                        step={componentProps.step > 0 ? componentProps.step : undefined}
                        type={componentProps.type}
                        value={value()}
                        onChange={redispatch}
                        onInput={handleInput}
                        onSelect={redispatch}
                    />
                    <span class={'suffix'}>{componentProps.suffixText}</span>
                </Field>
            </span>
        </span>
    )
}
