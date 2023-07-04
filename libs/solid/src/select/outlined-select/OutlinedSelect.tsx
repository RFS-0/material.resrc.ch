import './styles/outlined-select-styles.css';
import {FilledField} from '../../field';
import {splitProps} from 'solid-js';

export type SelectProps = {
    disabled?: boolean
    error?: boolean
}

export const OutlinedSelect = (props: SelectProps) => {
    const [componentProps, ] = splitProps(props, [
        'disabled',
        'error',
    ]);

    return (
        <span
            class="select__container"
            classList={{
                'select--disabled': componentProps.disabled,
            }}
        >

        <FilledField></FilledField>
        </span>
    )
}
