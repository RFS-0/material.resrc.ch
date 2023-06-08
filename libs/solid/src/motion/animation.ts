/**
 * Easing functions to use for web animations.
 *
 */
export enum Easing {
  STANDARD = 'cubic-bezier(0.2, 0, 0, 1)',
}

/**
 * A signal that is used for abortable tasks.
 */
export interface AnimationSignal {
  /**
   * Starts the abortable task. Any previous tasks started with this instance
   * will be aborted.
   *
   * @return An `AbortSignal` for the current task.
   */
  start(): AbortSignal;
  /**
   * Complete the current task.
   */
  finish(): void;
}

/**
 * Creates an `AnimationSignal` that can be used to cancel a previous task.
 *
 * @example
 * class MyClass {
 *   private labelAnimationSignal = createAnimationSignal();
 *
 *   private async animateLabel() {
 *     // Start of the task. Previous tasks will be canceled.
 *     const signal = this.labelAnimationSignal.start();
 *
 *     // Do async work...
 *     if (signal.aborted) {
 *       // Use AbortSignal to check if a request was made to abort after some
 *       // asynchronous work.
 *       return;
 *     }
 *
 *     const animation = this.animate(...);
 *     // Add event listeners to be notified when the task should be canceled.
 *     signal.addEventListener('abort', () => {
 *       animation.cancel();
 *     });
 *
 *     animation.addEventListener('finish', () => {
 *       // Tell the signal that the current task is finished.
 *       this.labelAnimationSignal.finish();
 *     });
 *   }
 * }
 *
 * @return An `AnimationSignal`.
 */
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

