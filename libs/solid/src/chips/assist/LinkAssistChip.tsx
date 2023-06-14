import {createSignal, JSX, Show, splitProps} from 'solid-js';
import {FocusRing} from '../../focus';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import './styles/assist-chip-styles.css';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';

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

    const [focus, setFocus] = createSignal(componentProps?.showFocusRing || false);
    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    const rippleDisabled = () => {
        return componentProps?.disableRipple || false;
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

    return (
        <div
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
            <FocusRing visible={focus()}></FocusRing>
            <Ripple
                disabled={rippleDisabled()}
                listen={listen}
                unbounded={true}
            />
            <a
                {...linkProps}
                {...rippleHandlers}
                onFocus={composeEventHandlers([linkProps?.onfocus, activateFocus])}
                onBlur={composeEventHandlers([linkProps?.onblur, deactivateFocus])}
                onPointerDown={composeEventHandlers([
                    linkProps?.onPointerDown,
                    rippleHandlers.onPointerDown,
                    deactivateFocus
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

