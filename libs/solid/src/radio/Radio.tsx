import './styles/radio-styles.css';
import {createSignal, onCleanup, onMount, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import {isActivationClick} from '../controller';
import {SingleSelectionController} from './single-selection-controller';
import {focusController as fc} from '../focus';

export type RadioProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    checked?: boolean;
    disabled?: boolean;
    name?: string;
    showFocusRing?: boolean;
    value?: string;
}

export const Radio = (props: RadioProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps,] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'checked',
        'disabled',
        'name',
        'showFocusRing',
        'value'
    ]);

    let radioElement: HTMLDivElement | null = null;
    let inputElement: HTMLInputElement | null = null;
    let selectionController: SingleSelectionController | null = null;
    let observer: MutationObserver;


    const [checked, setChecked] = createSignal(componentProps.checked || false);

    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);

    const value = componentProps.value || 'on';

    const updateChecked = (newValue: boolean) => {
        const wasChecked = checked();
        if (wasChecked === newValue) {
            return;
        }
        setChecked(newValue);
    }

    const handleChange = () => {
        if (componentProps.disabled) {
            return;
        }
        updateChecked(true);
        selectionController?.handleCheckedChange();
    }

    const handleMutations = (mutations: MutationRecord[]) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === 'data-checked') {
                const isChecked = inputElement.hasAttribute('data-checked');
                updateChecked(isChecked);
            }
        }
    }

    const focus = () => {
        inputElement?.focus();
    }

    onMount(() => {
        inputElement.addEventListener('click', (event: Event) => {
            if (!isActivationClick(event)) {
                return;
            }
            focus();
        });
        selectionController = new SingleSelectionController(inputElement);
        selectionController.connect();
        observer = new MutationObserver((mutations) => handleMutations(mutations));
        observer.observe(inputElement, {attributes: true, attributeFilter: ['data-checked']});
    });

    onCleanup(() => {
        selectionController?.disconnect();
    });

    return (
        <div
            {...rippleHandlers}
            ref={radioElement}
            use:focusController={{
                disabled: !componentProps.showFocusRing,
            }}
            class="radio-shared"
            classList={{
                'radio--checked': checked(),
            }}
            onFocus={focus}
            data-disabled={componentProps.disabled || undefined}
        >
            <Ripple listen={listen} unbounded={true}></Ripple>
            <svg class="radio__icon" viewBox="0 0 20 20">
                <mask id="cutout">
                    <rect width="100%" height="100%" fill="white"/>
                    <circle cx={10} cy={10} r={8} fill="black"/>
                </mask>
                <circle class="radio__circle radio__circle--outer" cx={10} cy={10} r={10} mask="url(#cutout)"/>
                <circle class="radio__circle radio__circle--inner" cx={10} cy={10} r={5}/>
            </svg>
            <input
                ref={inputElement}
                type="radio"
                name={componentProps?.name || ''}
                aria-label={props?.ariaLabel || undefined}
                aria-haspopup={props?.ariaHasPopup || false}
                checked={checked()}
                value={value}
                disabled={componentProps.disabled}
                onChange={handleChange}
                data-checked={checked() || undefined}
            />
        </div>
    );
}
