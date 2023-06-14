import {Component, createSignal, ParentProps, Show, splitProps} from "solid-js"
import './styles/circular-progress-styles.css'

export type CircularProgressProps = {
    ariaHasPopup?: boolean;
    ariaLabel?: string
    fourColor?: boolean;
    indeterminate?: boolean,
    progress?: number,
} & ParentProps;

export const CircularProgress: Component<CircularProgressProps> = (props) => {
    const [componentProps, circularProps] = splitProps(props, [
        'children',
        'fourColor',
        'indeterminate',
        'progress',
    ]);

    const [dashOffset,] = createSignal((1 - componentProps.progress) * 100);
    const pathLength = 100;

    return (
        <div
            class={'circular-progress-container'}
        >
            <div
                class="circular-progress"
                classList={{
                    'indeterminate': componentProps.indeterminate,
                    'four-color': componentProps.fourColor,
                }}
                role={'progressbar'}
                aria-label={circularProps?.ariaLabel || ''}
                aria-haspopup={circularProps?.ariaHasPopup || false}
                aria-valuemin={0}
                aria-valuemax={1}
                aria-valuenow={componentProps.indeterminate ? undefined : componentProps.progress}>
                <Show when={!componentProps.indeterminate}
                      fallback={
                          <div class="spinner">
                              <div class="left">
                                  <div class="circle"></div>
                              </div>
                              <div class="right">
                                  <div class="circle"></div>
                              </div>
                          </div>
                      }
                >
                    <svg viewBox="0 0 4800 4800">
                        <circle class="track"
                                pathLength={pathLength}>
                        </circle>
                        <circle
                            class="progress"
                            pathLength={pathLength}
                            stroke-dashoffset={dashOffset()}>
                        </circle>
                    </svg>
                </Show>
                {componentProps.children}
            </div>
        </div>
    )
}
