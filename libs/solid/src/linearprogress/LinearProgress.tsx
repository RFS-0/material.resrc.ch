import './styles/linear-progress-styles.css';
import {createSignal, onCleanup, onMount, splitProps} from 'solid-js';

export type LinearProgressProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    buffer?: number
    fourColor?: boolean
    indeterminate?: boolean
    progress?: number
}

export const LinearProgress = (props: LinearProgressProps) => {
    const [componentProps,] = splitProps(props, [
        'ariaHasPopup',
        'ariaLabel',
        'buffer',
        'fourColor',
        'indeterminate',
        'progress',
    ]);

    const [animationReady, setAnimationReady] = createSignal(false);

    let progressElement: HTMLDivElement | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const bufferStyles = {
        transform: `scaleX(${(componentProps.indeterminate ? 1 : componentProps.buffer) * 100}%)`
    };
    const progressStyles = {
        transform: `scaleX(${(componentProps.indeterminate ? 1 : componentProps.progress) * 100}%)`
    };

    const restartAnimation = async () => {
        setAnimationReady(false);
        await new Promise(requestAnimationFrame);
        setAnimationReady(true);
    }

    onMount(() => {
        setAnimationReady(true);
        resizeObserver = new ResizeObserver(async () => {
            if (componentProps.indeterminate) {
                await restartAnimation();
            }
        });
    })

    onCleanup(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    })

    return (
        <div
            ref={progressElement}
            class={'linear-progress'}
            classList={{
                'animation-ready': animationReady(),
                'four-color': componentProps?.fourColor,
                'indeterminate': componentProps?.indeterminate,
            }}
            role={'progressbar'}
            aria-label={props?.ariaLabel || ''}
            aria-haspopup={props?.ariaHasPopup || false}
            aria-valuemin="0"
            aria-valuemax="1"
            aria-valuenow={componentProps.indeterminate ? '' : componentProps.progress}
        >
            <div class="track"></div>
            <div class="buffer-bar" style={bufferStyles}></div>
            <div class="bar primary-bar" style={progressStyles}>
                <div class="bar-inner"></div>
            </div>
            <div class="bar secondary-bar">
                <div class="bar-inner"></div>
            </div>
        </div>
    );
};
