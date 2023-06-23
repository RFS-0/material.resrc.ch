import {Accessor, onCleanup, onMount} from "solid-js"
import './focus-ring-styles.css'

export type FocusControllerOptions = {
    disabled?: boolean
    inward?: boolean
}

export function focusController(element: HTMLElement, options: Accessor<FocusControllerOptions>) {
    const opts = options();
    let focusElement: HTMLDivElement = document.createElement('div');
    focusElement.setAttribute('focus-ring', '');
    element.appendChild(focusElement)

    const showFocusRing = () => {
        if (opts?.disabled) {
            return;
        }
        focusElement.setAttribute('focus-ring-visible', '');
    };

    const hideFocusRing = () => {
        focusElement.removeAttribute('focus-ring-visible');
    }

    onMount(() => {
        if (opts?.inward) {
            focusElement.setAttribute('focus-ring-inward', '');
        }
        element.addEventListener('focusin', showFocusRing);
        element.addEventListener('focusout', hideFocusRing);
        element.addEventListener('pointerdown', hideFocusRing);
    });

    onCleanup(() => {
        focusElement.remove()
    })
}
