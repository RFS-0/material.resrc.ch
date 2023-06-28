export const EASING = {
    STANDARD: 'cubic-bezier(0.2, 0, 0, 1)',
    STANDARD_ACCELERATE: 'cubic-bezier(.3,0,1,1)',
    STANDARD_DECELERATE: 'cubic-bezier(0,0,0,1)',
    EMPHASIZED: 'cubic-bezier(.3,0,0,1)',
    EMPHASIZED_ACCELERATE: 'cubic-bezier(.3,0,.8,.15)',
    EMPHASIZED_DECELERATE: 'cubic-bezier(.05,.7,.1,1)',
} as const;

export interface AnimationSignal {
    start(): AbortSignal;
    finish(): void;
}

export function createAnimationSignal(): AnimationSignal {
    // The current animation's AbortController
    let animationAbortController: AbortController | null = null;

    return {
        start() {
            // Tell the previous animation to cancel.
            animationAbortController?.abort();
            // Set up a new AbortController for the current animation.
            animationAbortController = new AbortController();
            // Provide the AbortSignal so that the caller can check aborted status
            // and add listeners.
            return animationAbortController.signal;
        },
        finish() {
            animationAbortController = null;
        },
    };
}

export function createThrottle() {
    const stack = new Set();
    return async (
        key = '', cb: (...args: unknown[]) => unknown, timeout = async () => {
            await new Promise(requestAnimationFrame);
        }) => {
        if (!stack.has(key)) {
            stack.add(key);
            await timeout();
            if (stack.has(key)) {
                stack.delete(key);
                cb();
            }
        }
    };
}

export function msFromTimeCSSValue(value: string) {
    const match = value.trim().match(/([\d.]+)(\s*s$)?/);
    const time = match?.[1];
    const seconds = match?.[2];
    return Number(time ?? 0) * (seconds ? 1000 : 1);
}
