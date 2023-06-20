import {createEffect, JSX, Show, Signal, splitProps} from 'solid-js';
import './styles/dialog-styles.css';
import {Button} from '../button';

export type DialogProps = {
    headlinePrefix?: JSX.Element
    open: Signal<boolean>
} & JSX.HTMLAttributes<HTMLDialogElement>


export const Dialog = (props: DialogProps) => {
    const [componentProps, dialogProps] = splitProps(props, [
        'headlinePrefix',
        'open'
    ]);

    let dialogElement: HTMLDialogElement | null;
    let containerElement: HTMLDivElement | null;

    const [open, setOpen] = componentProps.open;

    const close = () => {
        setOpen(false);
        dialogElement.close()
    }

    const handleDialogClick = (e: Event) => {
        if (!open()) {
            return;
        }
        if (!e.composedPath().includes(containerElement)) {
            close();
        }
    }

    createEffect(() => {
        if (open()) {
            dialogElement.showModal()
        } else {
            dialogElement.close()
        }
    });

    return (
        <dialog
            ref={dialogElement}
            {...dialogProps}
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
                        headline
                    </div>
                    <div class={'headline-suffix'}>
                        <div>
                            headline-suffix
                        </div>
                    </div>
                </header>
                <section
                    class={'content'}
                >
                    <div>supporting text</div>
                </section>
                <footer class={'footer'}>
                    <Button variant={'text'} label={'Cancel'} onClick={close}/>
                    <Button variant={'text'} label={'Accept'} onClick={close}/>
                </footer>
            </div>
        </dialog>
    )
};
