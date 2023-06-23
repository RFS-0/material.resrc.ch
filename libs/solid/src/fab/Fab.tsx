import {createSignal, JSX, Show, splitProps} from 'solid-js';
import {Elevation} from '../elevation';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import './styles/fab-styles.css';
import {focusController as fc} from '../focus';

export type FabSize = 'medium' | 'small' | 'large';
export type Variant = 'surface' | 'primary' | 'secondary' | 'tertiary';

export type FabProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string;
    icon?: JSX.Element;
    label?: string;
    lowered?: boolean;
    reducedTouchTarget?: boolean;
    showFocusRing?: boolean;
    size?: FabSize;
    variant?: Variant;
} & JSX.HTMLAttributes<HTMLButtonElement>

export const Fab = (props: FabProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, buttonProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'icon',
        'label',
        'lowered',
        'reducedTouchTarget',
        'showFocusRing',
        'size',
        'variant',
    ]);

    const [extended,] = createSignal(!!componentProps.label);

    const {listen, emit} = createRippleEventEmitter();
    const rippleHandlers = createHandlers(emit);


    return (
        <button
            use:focusController={{
                disabled: !componentProps.showFocusRing,
            }}
            {...rippleHandlers}
            {...buttonProps}
            class={'base-fab fab'}
            classList={{
                'fab--lowered': componentProps?.lowered || false,
                'fab--small': componentProps?.size === 'small',
                'fab--large': componentProps?.size === 'large',
                'fab--extended': extended(),
                'fab--primary': componentProps?.variant === 'primary',
                'fab--secondary': componentProps?.variant === 'secondary',
                'fab--tertiary': componentProps?.variant === 'tertiary',
            }}
            aria-label={componentProps?.ariaLabel || ''}
            aria-haspopup={componentProps?.ariaHasPopup || false}

        >
            <Elevation/>
            <Ripple listen={listen} unbounded={true}/>
            <Show when={!componentProps.reducedTouchTarget}>
                <div class={'fab__touch-target'}></div>
            </Show>
            <Show when={!!componentProps.icon}>
                <span class={'fab__icon'}>{componentProps.icon}</span>
            </Show>
            <Show when={!!componentProps.label}>
                <span class={'fab__label'}>{componentProps.label}</span>
            </Show>
        </button>
    );
};
