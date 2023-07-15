import {createEventBus, Emit, EventBus, Listen} from '@solid-primitives/event-bus';
import {createSignal, JSX, ParentComponent, splitProps, VoidProps} from 'solid-js';
import {createAnimationSignal, EASING} from "../motion";
import './styles/ripple-styles.css';

const PRESS_GROW_MS = 450;
const MINIMUM_PRESS_MS = 225;
const INITIAL_ORIGIN_SCALE = 0.2;
const PADDING = 10;
const SOFT_EDGE_MINIMUM_SIZE = 75;
const SOFT_EDGE_CONTAINER_RATIO = 0.35;
const PRESS_PSEUDO = '::after';
const ANIMATION_FILL = 'forwards';
const TOUCH_DELAY_MS = 150;

enum State {
    INACTIVE,
    TOUCH_DELAY,
    HOLDING,
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

export type RippleProps = {
    disabled?: boolean;
    listen: Listen<RippleEvent>;
    rippleClass?: string;
} & JSX.HTMLAttributes<HTMLDivElement> & VoidProps


export const Ripple: ParentComponent<RippleProps> = (props) => {
    const [componentProps, rippleProps] = splitProps(props, [
        'disabled',
        'listen',
        'rippleClass',
    ]);
    let rippleElement: HTMLDivElement | null = null;

    const [disabled, __] = createSignal(componentProps?.disabled || false);
    const [hovered, setHovered] = createSignal(false);
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
        return (rippleElement.parentElement ?? rippleElement).getBoundingClientRect();
    };

    const determineRippleSize = () => {
        const {height, width} = getDimensions();
        const maxDim = Math.max(height, width);
        const softEdgeSize = Math.max(SOFT_EDGE_CONTAINER_RATIO * maxDim, SOFT_EDGE_MINIMUM_SIZE);

        const initialSize = Math.floor(maxDim * INITIAL_ORIGIN_SCALE);
        const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
        const maxRadius = hypotenuse + PADDING;

        rippleScale = `${(maxRadius + softEdgeSize) / initialSize}`;
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

        let _growAnimation = rippleElement.animate(
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
                easing: EASING.STANDARD,
                fill: ANIMATION_FILL,
            }
        );

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
        const {top, left, bottom, right} = rippleElement!.getBoundingClientRect();
        return x >= left && x <= right && y >= top && y <= bottom;
    };

    const waitForTouchHold = () => {
        if (touchTimer !== null) {
            clearTimeout(touchTimer);
        }
        state = State.TOUCH_DELAY;
        touchTimer = window.setTimeout(async () => {
            if (rippleElement === null || state !== State.TOUCH_DELAY) {
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

    componentProps.listen(rippleEvent => {
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
            class={['ripple-shared ripple__container', componentProps.rippleClass].join(' ')}
            classList={{
                'ripple--disabled': disabled(),
            }}
        >
            <div
                ref={rippleElement!}
                {...props}
                class='ripple__surface'
                classList={{
                    'ripple__surface--hovered': hovered(),
                    'ripple__surface--pressed': pressed(),
                }}
            />
        </div>
    );
};
