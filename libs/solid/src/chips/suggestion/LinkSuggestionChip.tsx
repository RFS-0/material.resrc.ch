import {createSignal, JSX, Show, splitProps} from 'solid-js';
import {FocusRing} from '../../focus';
import {createHandlers, createRippleEventEmitter, Ripple} from '../../ripple';
import './styles/suggestion-chip-styles.css';
import {composeEventHandlers} from '../../controller';
import {Elevation} from '../../elevation';

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
    const [componentProps, linkProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'disabled',
        'disableRipple',
        'elevated',
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
            class={'chip-shared suggestion-chip container'}
            classList={{
                'disabled': componentProps.disabled,
                'elevated': componentProps.elevated
            }}
        >
            <Show
                when={componentProps.elevated}
                fallback={
                    <span class="outline"></span>
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
                {...rippleHandlers}
                {...linkProps}

                onFocus={composeEventHandlers([linkProps?.onfocus, activateFocus])}
                onBlur={composeEventHandlers([linkProps?.onblur, deactivateFocus])}
                onPointerDown={composeEventHandlers([
                    linkProps?.onPointerDown,
                    rippleHandlers.onPointerDown,
                    deactivateFocus
                ])}
                aria-label={componentProps?.ariaLabel || ''}
                aria-haspopup={componentProps?.ariaHasPopup || false}
                class='primary action'
            >
                <span class="label">{componentProps.label}</span>
                <span class="touch"></span>
            </a>
        </div>
    )
}

