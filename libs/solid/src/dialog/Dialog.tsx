import {createEffect, JSX, Show, Signal, splitProps} from 'solid-js';
import './styles/dialog-styles.css';

export type DialogProps = {
    footer?: JSX.Element;
    headline: string;
    headlinePrefix?: JSX.Element;
    headlineSuffix?: JSX.Element;
    open: Signal<boolean>;
    supportingText?: JSX.Element;
} & JSX.HTMLAttributes<HTMLDialogElement>


export const Dialog = (props: DialogProps) => {
    const [componentProps, dialogProps] = splitProps(props, [
        'footer',
        'headline',
        'headlinePrefix',
        'headlineSuffix',
        'open',
        'supportingText',
    ]);

    let dialogElement: HTMLDialogElement | null;
    let containerElement: HTMLDivElement | null;

    const [open, setOpen] = componentProps.open;

    const showModal = () => {
        setOpen(true);
        if (!dialogElement || dialogElement.open) {
            return;
        }
        dialogElement.showModal()
    }

    const closeModal = () => {
        setOpen(false);
        dialogElement.close()
    }

    const handleDialogClick = (e: Event) => {
        if (!open()) {
            return;
        }
        if (!e.composedPath().includes(containerElement)) {
            closeModal();
        }
    }

    createEffect(() => {
        if (open()) {
            showModal()
        } else {
            closeModal()
            dialogElement.close()
        }
    });

    return (
        <dialog
            ref={dialogElement}
            class={'base-dialog dialog'}
            classList={{
                'showing-open': open(),
            }}
            onClick={handleDialogClick}
        >
            <div
                ref={containerElement}
                class={'container'}
            >
                <header
                    class={'header'}
                    classList={{
                        'has-headline-prefix': !!componentProps.headlinePrefix,
                    }}
                >
                    <Show when={!!componentProps.headlinePrefix}>
                        <div class={'headline-prefix'}>
                            {componentProps.headlinePrefix}
                        </div>
                    </Show>
                    <div class={'headline'}>
                        {componentProps.headline}
                    </div>
                    <Show when={!!componentProps.headline}>
                        <div class={'headline-suffix'}>
                            {componentProps.headlineSuffix}
                        </div>
                    </Show>
                </header>
                <section
                    class={'content'}
                >
                    <Show when={!!componentProps.supportingText}>
                        <div class={'list-item__supporting-text'}>
                            {componentProps.supportingText}
                        </div>
                    </Show>
                </section>
                <Show when={!!componentProps.footer}>
                    <footer class={'footer'}>
                        {componentProps.footer}
                    </footer>
                </Show>
            </div>
        </dialog>
    )
};
