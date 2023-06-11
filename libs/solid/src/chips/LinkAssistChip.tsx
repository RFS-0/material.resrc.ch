import {createSignal, JSX, splitProps} from 'solid-js';
import {FocusRing} from '../focus';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import './styles/assist-chip-styles.css';

export type LinkAssistChipProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    disabled?: boolean;
    elevated?: boolean;
    href?: string;
    icon: JSX.Element
    label?: string;
    showFocusRing?: boolean;
    target?: '_blank' | '_parent' | '_self' | '_top' | '';
} & JSX.HTMLAttributes<HTMLLinkElement>

export const LinkAssistChip = (props: LinkAssistChipProps) => {
    const [componentProps, chipProps] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'disabled',
        'elevated',
        'href',
        'icon',
        'label',
        'showFocusRing',
        'target'
    ]);

    const [focus, setFocus] = createSignal(componentProps?.showFocusRing || false);
    const {listen, emit} = createRippleEventEmitter();

    const rippleHandlers = createHandlers(emit);

    return (
        <div
            {...rippleHandlers}
            class={'chip-shared assist-chip container'}
            classList={{
                'disabled': props?.disabled
            }}
        >
            <span class="outline"></span>
            <FocusRing visible={focus()}></FocusRing>
            <Ripple
                listen={listen}
                unbounded={true}
            />
            <a
                aria-label={props?.ariaLabel || ''}
                aria-haspopup={props?.ariaHasPopup || false}
                class='primary action'
                href={props?.href}
                target={props?.target}
            >
                <span class="leading icon">{componentProps.icon}</span>
                <span class="label">${componentProps.label}</span>
                <span class="touch"></span>
            </a>
        </div>
    )
}

