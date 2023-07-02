import {JSX, Show, splitProps} from 'solid-js';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import './styles/assist-chip-styles.css';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';
import {focusController as fc} from '../../focus';

export type LinkAssistChipProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    disabled?: boolean;
    disableRipple?: boolean;
    elevated?: boolean;
    href: string;
    icon: JSX.Element
    label: string;
    showFocusRing?: boolean;
    target: '_blank' | '_parent' | '_self' | '_top' | '';
} & JSX.HTMLAttributes<HTMLAnchorElement>

export const LinkAssistChip = (props: LinkAssistChipProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps, linkProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'disabled',
        'disableRipple',
        'elevated',
        'icon',
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
                'chip-disabled': componentProps.disabled,
                'chip-elevated': componentProps.elevated
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
            />
            <a
                {...linkProps}
                {...rippleHandlers}
                onPointerDown={composeEventHandlers([
                    linkProps?.onPointerDown,
                    rippleHandlers.onPointerDown,
                ])}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='chip-primary chip-action'
            >
                <Show when={componentProps.icon}
                      fallback={<span></span>}
                >
                    <span class="chip-leading chip-icon">{componentProps.icon}</span>
                </Show>
                <span class="chip-label">{componentProps.label}</span>
                <span class="chip-touch"></span>
            </a>
        </div>
    )
}

