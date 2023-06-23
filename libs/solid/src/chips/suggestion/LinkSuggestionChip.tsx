import {JSX, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import './styles/suggestion-chip-styles.css';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';
import {focusController as fc} from '../../focus';

export type LinkSuggestionChipProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    disabled?: boolean;
    disableRipple?: boolean;
    elevated?: boolean;
    href: string;
    label: string;
    showFocusRing?: boolean;
    target: '_blank' | '_parent' | '_self' | '_top' | '';
} & JSX.HTMLAttributes<HTMLAnchorElement>

export const LinkSuggestionChip = (props: LinkSuggestionChipProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, linkProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'disabled',
        'disableRipple',
        'elevated',
        'label',
        'showFocusRing',
    ]);

    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    const rippleDisabled = () => {
        return componentProps?.disableRipple || false;
    }

    return (
        <div
            use:focusController={{
                disabled: !componentProps.showFocusRing,
            }}
            class={'chip-shared suggestion-chip chip-container'}
            classList={{
                'disabled': componentProps.disabled,
                'elevated': componentProps.elevated
            }}
        >
            <Show
                when={componentProps.elevated}
                fallback={
                    <span class="chip-outline"></span>
                }
            >
                <Elevation/>
            </Show>
            <Ripple
                disabled={rippleDisabled()}
                listen={listen}
                unbounded={true}
            />
            <a
                {...rippleHandlers}
                {...linkProps}

                onPointerDown={composeEventHandlers([
                    linkProps?.onPointerDown,
                    rippleHandlers.onPointerDown,
                ])}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='chip-primary chip-action'
            >
                <span class="chip-label">{componentProps.label}</span>
                <span class="chip-touch"></span>
            </a>
        </div>
    )
}
