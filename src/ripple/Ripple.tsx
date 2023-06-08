import {createEventBus, Emit, EventBus, Listen} from '@solid-primitives/event-bus';
import {createSignal, JSX, ParentComponent, ParentProps} from 'solid-js';
import { createAnimationSignal, Easing } from "../motion";
import './ripple-styles.css';

enum State {
    /**
     * Initial state of the control, no touch in progress.
     *
     * Transitions:
     *   - on touch down: transition to `TOUCH_DELAY`.
     *   - on mouse down: transition to `WAITING_FOR_CLICK`.
     */
    INACTIVE,
    /**
     * Touch down has been received, waiting to determine if it's a swipe or
     * scroll.
     *
     * Transitions:
     *   - on touch up: beginPress(); transition to `WAITING_FOR_CLICK`.
     *   - on cancel: transition to `INACTIVE`.
     *   - after `TOUCH_DELAY_MS`: beginPress(); transition to `HOLDING`.
     */
    TOUCH_DELAY,
    /**
     * A touch has been deemed to be a press
     *
     * Transitions:
     *  - on up: transition to `WAITING_FOR_CLICK`.
     */
    HOLDING,
    /**
     * The user touch has finished, transition into rest state.
     *
     * Transitions:
     *   - on click endPress(); transition to `INACTIVE`.
     */
    WAITING_FOR_CLICK
}

type RippleEvent = {
    type: 'click' | 'contextmenu' | 'pointercancel' | 'pointerdown' | 'pointerenter' | 'pointerleave' | 'pointerup',
    pointerEvent?: Event | PointerEvent
};

export function createRippleEventEmitter(): EventBus<RippleEvent> {
    return createEventBus<RippleEvent>();
}

type RippleHandlers = {
    onClick: (pointerEvent?: Event | PointerEvent) => void
    onContextMenu: (pointerEvent?: Event | PointerEvent) => void
    onPointerCancel: (pointerEvent?: Event | PointerEvent) => void
    onPointerDown: (pointerEvent?: Event | PointerEvent) => void
    onPointerEnter: (pointerEvent?: Event | PointerEvent) => void
    onPointerLeave: (pointerEvent?: Event | PointerEvent) => void
    onPointerUp: (pointerEvent?: Event | PointerEvent) => void
}

export function createHandlers(emit: Emit<RippleEvent>): RippleHandlers {
    return {
        onClick: (ev) => emit({type: 'click', pointerEvent: (ev)}),
        onContextMenu: (ev) => emit({type: 'contextmenu', pointerEvent: (ev)}),
        onPointerCancel: (ev) => emit({type: 'pointercancel', pointerEvent: (ev)}),
        onPointerDown: (ev) => emit({type: 'pointerdown', pointerEvent: (ev)}),
        onPointerEnter: (ev) => emit({type: 'pointerenter', pointerEvent: (ev)}),
        onPointerLeave: (ev) => emit({type: 'pointerleave', pointerEvent: (ev)}),
        onPointerUp: (ev) => emit({type: 'pointerup', pointerEvent: (ev)}),
    };
}

export type RippleProps = ParentProps & JSX.IntrinsicElements['div'] & {
    listen: Listen<RippleEvent>
    unbounded?: boolean
    disabled?: boolean
}

export const Ripple: ParentComponent<RippleProps> = (props) => {
    let rippler!: HTMLDivElement;

    const PRESS_GROW_MS = 450;
    const MINIMUM_PRESS_MS = 225;
    const INITIAL_ORIGIN_SCALE = 0.2;
    const PADDING = 10;
    const SOFT_EDGE_MINIMUM_SIZE = 75;
    const SOFT_EDGE_CONTAINER_RATIO = 0.35;
    const PRESS_PSEUDO = '::after';
    const ANIMATION_FILL = 'forwards';
    const TOUCH_DELAY_MS = 150;

    const [unbounded, _] = createSignal(props?.unbounded || false);
    const [disabled, __] = createSignal(props?.disabled || false);
    const [hovered, setHovered] = createSignal(false);
    const [focused] = createSignal(false);
    const [pressed, setPressed] = createSignal(false);

    let rippleSize = '';
    let rippleScale = '';
    let initialSize = 0;
    let pressAnimationSignal = createAnimationSignal();
    let growAnimation: Animation | null = null;
    let delayedEndPressHandle: number | null = null;

    let state: State = State.INACTIVE;
    let checkBoundsAfterContextMenu = false;
    let rippleStartEvent: PointerEvent | null = null;
    let touchTimer: number | null = null;
    let clickTimer: number | null = null;

    const getDimensions = () => {
        return (rippler.parentElement ?? rippler).getBoundingClientRect();
    };

    const determineRippleSize = () => {
        const {height, width} = getDimensions();
        const maxDim = Math.max(height, width);
        const softEdgeSize =
            Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);

        let maxRadius: number;
        let _initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);

        const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
        maxRadius = hypotenuse + PADDING;

        // ensure `initialSize` is even for unbounded
        if (unbounded()) {
            _initialSize = _initialSize - (_initialSize % 2);
        }

        initialSize = _initialSize;
        rippleScale = `${(maxRadius + softEdgeSize) / _initialSize}`;
        rippleSize = `${initialSize}px`;
    };

    const getNormalizedPointerEventCoords: (pointerEvent: Event & Record<'pageX', number> & Record<'pageY', number>) => {
        x: number,
        y: number
    } = (pointerEvent) => {
        const {scrollX, scrollY} = window;
        const {left, top} = getDimensions();
        const documentX = scrollX + left;
        const documentY = scrollY + top;
        const {pageX, pageY} = pointerEvent;
        return {x: pageX - documentX, y: pageY - documentY};
    };

    const getTranslationCoordinates = (positionEvent?: Event | null) => {
        const {height, width} = getDimensions();
        // end in the center
        const endPoint = {
            x: (width - initialSize) / 2,
            y: (height - initialSize) / 2,
        };

        let startPoint: { x: number; y: number };
        if (
            positionEvent && 'pageX' in positionEvent &&
            'pageY' in positionEvent &&
            typeof positionEvent['pageX'] === 'number' &&
            typeof positionEvent['pageY'] === 'number'
        ) {
            const pointerEvent = positionEvent as Event & Record<'pageX', number> & Record<'pageY', number>;
            startPoint = getNormalizedPointerEventCoords(pointerEvent);
        } else {
            console.log('no position event');
            startPoint = {
                x: width / 2,
                y: height / 2,
            };
        }

        // center around start point
        startPoint = {
            x: startPoint.x - (initialSize / 2),
            y: startPoint.y - (initialSize / 2),
        };

        return {startPoint, endPoint};
    };

    const startPressAnimation = (positionEvent?: Event | null) => {
        determineRippleSize();
        const {startPoint, endPoint} =
            getTranslationCoordinates(positionEvent);
        const translateStart = `${startPoint.x}px, ${startPoint.y}px`;
        const translateEnd = `${endPoint.x}px, ${endPoint.y}px`;

        const signal = pressAnimationSignal.start();

        let _growAnimation = rippler.animate(
            {
                top: [0, 0],
                left: [0, 0],
                height: [rippleSize, rippleSize],
                width: [rippleSize, rippleSize],
                transform: [
                    `translate(${translateStart}) scale(1)`,
                    `translate(${translateEnd}) scale(${rippleScale})`,
                ],
            },
            {
                pseudoElement: PRESS_PSEUDO,
                duration: PRESS_GROW_MS,
                easing: Easing.STANDARD,
                fill: ANIMATION_FILL,
            });

        _growAnimation.addEventListener('finish', () => {
            pressAnimationSignal.finish();
            growAnimation = null;
        });

        signal.addEventListener('abort', () => {
            _growAnimation.cancel();
            growAnimation = null;
        });

        growAnimation = _growAnimation;
    };

    const beginHover = (hoverEvent?: Event) => {
        if ((hoverEvent as PointerEvent)?.pointerType !== 'touch') {
            setHovered(true);
        }
    };

    const endHover = () => {
        setHovered(false);
    };
    const beginPress = (positionEvent?: Event | null) => {
        setPressed(true);
        if (delayedEndPressHandle !== null) {
            clearTimeout(delayedEndPressHandle);
            delayedEndPressHandle = null;
        }
        startPressAnimation(positionEvent);
    };

    const endPress = () => {
        const pressAnimationPlayState = growAnimation?.currentTime as number ?? Infinity;
        if (pressAnimationPlayState >= MINIMUM_PRESS_MS) {
            setPressed(false);
        } else {
            delayedEndPressHandle = window.setTimeout(() => {
                setPressed(false);
                delayedEndPressHandle = null;
            }, MINIMUM_PRESS_MS - pressAnimationPlayState);
        }
        state = State.INACTIVE;
        rippleStartEvent = null;
        if (touchTimer) {
            clearTimeout(touchTimer);
            touchTimer = null;
        }
        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
        }
    };

    const isTouch = ({pointerType}: PointerEvent) => {
        return pointerType === 'touch';
    };

    const shouldReactToEvent = (ev: PointerEvent, hovering: boolean) => {
        const enabled = !disabled();
        const isPrimaryPointer = ev.isPrimary;
        const isInteractionPointer = rippleStartEvent === null || rippleStartEvent.pointerId === ev.pointerId;
        const isPrimaryButton = ev.buttons === 1;
        return enabled && isPrimaryPointer && isInteractionPointer &&
            (isTouch(ev) || isPrimaryButton || hovering);
    };

    const click = (ev: PointerEvent) => {
        // Click is a MouseEvent in Firefox and Safari, so we cannot use
        // `shouldReactToEvent`
        if (disabled()) {
            return;
        }
        if (state === State.WAITING_FOR_CLICK) {
            endPress();
        } else if (state === State.INACTIVE) {
            // keyboard synthesized click event
            beginPress(ev);
            endPress();
        }
    };

    const contextMenu = () => {
        if (!disabled()) {
            checkBoundsAfterContextMenu = true;
            endPress();
        }
    };

    const inBounds = ({x, y}: PointerEvent) => {
        const {top, left, bottom, right} = rippler!.getBoundingClientRect();
        return x >= left && x <= right && y >= top && y <= bottom;
    };

    const waitForTouchHold = () => {
        if (touchTimer !== null) {
            clearTimeout(touchTimer);
        }
        state = State.TOUCH_DELAY;
        touchTimer = window.setTimeout(async () => {
            if (rippler === null || state !== State.TOUCH_DELAY) {
                return;
            }
            state = State.HOLDING;
            beginPress();
        }, TOUCH_DELAY_MS);
    };

    const pointerDown = (ev: PointerEvent) => {
        if (!shouldReactToEvent(ev, true)) {
            return;
        }
        rippleStartEvent = ev;
        if (isTouch(ev)) {
            // after a longpress contextmenu event, an extra `pointerdown` can be
            // dispatched to the pressed element. Check that the down is within
            // bounds of the element in this case.
            if (checkBoundsAfterContextMenu && !inBounds(ev)) {
                return;
            }
            checkBoundsAfterContextMenu = false;
            waitForTouchHold();
        } else {
            state = State.WAITING_FOR_CLICK;
            beginPress(ev);
        }
    };

    const pointerCancel = (ev: PointerEvent) => {
        if (shouldReactToEvent(ev, true)) {
            endPress();
        }
    };

    const pointerEnter = (ev: PointerEvent) => {
        if (shouldReactToEvent(ev, true)) {
            beginHover(ev);
        }
    };

    const pointerLeave = (ev: PointerEvent) => {
        if (shouldReactToEvent(ev, true)) {
            endHover();
            // release a held mouse or pen press that moves outside the element
            if (!isTouch(ev) && state !== State.INACTIVE) {
                endPress();
            }
        }
    };

    const pointerUp = (ev: PointerEvent) => {
        if (!isTouch(ev) || !shouldReactToEvent(ev, true)) {
            return;
        }
        if (state === State.HOLDING) {
            state = State.WAITING_FOR_CLICK;
        } else if (state === State.TOUCH_DELAY) {
            state = State.WAITING_FOR_CLICK;
            beginPress(ev);
        }
    };

    props.listen(rippleEvent => {
        switch (rippleEvent.type) {
            case 'click':
                click(rippleEvent.pointerEvent as PointerEvent);
                break;
            case 'contextmenu':
                contextMenu();
                break;
            case 'pointercancel':
                pointerCancel(rippleEvent.pointerEvent as PointerEvent);
                break;
            case 'pointerdown':
                pointerDown(rippleEvent.pointerEvent as PointerEvent);
                break;
            case 'pointerenter':
                pointerEnter(rippleEvent.pointerEvent as PointerEvent);
                break;
            case 'pointerleave':
                pointerLeave(rippleEvent.pointerEvent as PointerEvent);
                break;
            case 'pointerup':
                pointerUp(rippleEvent.pointerEvent as PointerEvent);
                break;
            default:
                console.error('Unknown ripple event type', rippleEvent);
                break;
        }
    });

    // noinspection JSUnusedAssignment
    return (
        <div
            class='ripple-container'
        >
            <div
                ref={rippler!}
                {...props}
                class='ripple ripple-surface'
                classList={{
                    'ripple--hovered': hovered(),
                    'ripple--focused': focused(),
                    'ripple--pressed': pressed(),
                    'ripple--unbounded': unbounded(),
                }}
            >
                {props.children}
            </div>
        </div>
    );
};
