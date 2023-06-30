export class SingleSelectionController {
    private focused = false;
    private root: ParentNode | null = null;

    constructor(private readonly host: HTMLElement) {
    }

    connect() {
        this.root = this.host.getRootNode() as ParentNode;
        this.host.addEventListener('keydown', this.handleKeyDown);
        this.host.addEventListener('focusin', this.handleFocusIn);
        this.host.addEventListener('focusout', this.handleFocusOut);
    }

    disconnect() {
        this.host.removeEventListener('keydown', this.handleKeyDown);
        this.host.removeEventListener('focusin', this.handleFocusIn);
        this.host.removeEventListener('focusout', this.handleFocusOut);
        this.updateTabIndices();
        this.root = null;
    }

    handleCheckedChange() {
        if (!this.host.hasAttribute('data-checked')) {
        }
        this.uncheckSiblings();
        this.updateTabIndices();
    }

    private readonly handleFocusIn = () => {
        this.focused = true;
        this.updateTabIndices();
    };

    private readonly handleFocusOut = () => {
        this.focused = false;
        this.updateTabIndices();
    };

    private uncheckSiblings() {
        for (const sibling of this.getNamedSiblings()) {
            if (sibling !== this.host) {
                sibling.removeAttribute('data-checked');
            }
        }
    }

    private updateTabIndices() {
        // There are three tabindex states for a group of elements:
        // 1. If any are checked, that element is focusable.
        const siblings = this.getNamedSiblings();
        const checkedSibling = siblings.find(sibling => sibling.hasAttribute('data-checked'));
        // 2. If an element is focused, the others are no longer focusable.
        if (checkedSibling || this.focused) {
            const focusable = checkedSibling || this.host;
            focusable.removeAttribute('tabindex');

            for (const sibling of siblings) {
                if (sibling !== focusable) {
                    sibling.tabIndex = -1;
                }
            }
            return;
        }

        // 3. If none are checked or focused, all are focusable.
        for (const sibling of siblings) {
            sibling.removeAttribute('tabindex');
        }
    }

    /**
     * Retrieves all siblings in the host element's root with the same `name`
     * attribute.
     */
    private getNamedSiblings() {
        const name = this.host.getAttribute('name');
        if (!name || !this.root) {
            return [];
        }

        return Array.from(this.root.querySelectorAll<HTMLElement>(`[name="${name}"]`));
    }

    /**
     * Handles arrow key events from the host. Using the arrow keys will
     * select and check the next or previous sibling with the host's
     * `name` attribute.
     */
    private readonly handleKeyDown = (event: KeyboardEvent) => {
        const isDown = event.key === 'ArrowDown';
        const isUp = event.key === 'ArrowUp';
        const isLeft = event.key === 'ArrowLeft';
        const isRight = event.key === 'ArrowRight';
        // Ignore non-arrow keys
        if (!isLeft && !isRight && !isDown && !isUp) {
            return;
        }

        // Don't try to select another sibling if there aren't any.
        const siblings = this.getNamedSiblings();
        if (!siblings.length) {
            return;
        }

        // Prevent default interactions on the element for arrow keys,
        // since this controller will introduce new behavior.
        event.preventDefault();

        // Check if moving forwards or backwards
        const isRtl = getComputedStyle(this.host).direction === 'rtl';
        const forwards = isRtl ? isLeft || isDown : isRight || isDown;

        const hostIndex = siblings.indexOf(this.host);
        let nextIndex = forwards ? hostIndex + 1 : hostIndex - 1;
        // Search for the next sibling that is not disabled to select.
        // If we return to the host index, there is nothing to select.
        while (nextIndex !== hostIndex) {
            if (nextIndex >= siblings.length) {
                // Return to start if moving past the last item.
                nextIndex = 0;
            } else if (nextIndex < 0) {
                // Go to end if moving before the first item.
                nextIndex = siblings.length - 1;
            }

            // Check if the next sibling is disabled. If so,
            // move the index and continue searching.
            const nextSibling = siblings[nextIndex];
            if (nextSibling.hasAttribute('disabled')) {
                if (forwards) {
                    nextIndex++;
                } else {
                    nextIndex--;
                }

                continue;
            }

            // Uncheck and remove focusability from other siblings.
            for (const sibling of siblings) {
                if (sibling !== nextSibling) {
                    sibling.removeAttribute('data-checked');
                    sibling.tabIndex = -1;
                }
            }

            // The next sibling should be checked and focused.
            nextSibling.setAttribute('data-checked', '');
            nextSibling.removeAttribute('tabindex');
            nextSibling.focus();
            break;
        }
    };
}
