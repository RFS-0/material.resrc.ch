import {createMemo, createSignal, onMount, Show, splitProps} from 'solid-js';
import {Elevation} from '../elevation';
import {focusController as fc} from '../focus';
import {createHandlers, createRippleEventEmitter, Ripple} from '../ripple';
import {composeEventHandlers, dispatchActivationClick, isActivationClick, redispatchEvent} from '../controller';
import './styles/slider-styles.css';

export type SliderProps = {
    disabled?: boolean;
    disableFocusRings?: boolean;
    labeled?: boolean;
    max?: number;
    min?: number;
    ranged?: boolean;
    step?: number;
    ticks?: boolean;
    valueStart?: number;
    valueEnd?: number;
    valueStartLabel?: string;
    valueEndLabel?: string;
}

interface Action {
    canFlip: boolean;
    flipped: boolean;
    target: HTMLInputElement;
    fixed: HTMLInputElement;
    values: Map<HTMLInputElement | undefined, number | undefined>;
}

type InputProps = {
    value: number;
    label: string;
}

type HandleProps = {
    hover: boolean;
    label: string;
}

type SliderState = {
    handleStart: HandleProps;
    handleEnd: HandleProps;
    inputStart: InputProps;
    inputEnd: InputProps;
    isOverlapping: boolean;
    startOnTop: boolean;
}

function isOverlapping(elA: Element | null, elB: Element | null) {
    if (!(elA && elB)) {
        return false;
    }
    const a = elA.getBoundingClientRect();
    const b = elB.getBoundingClientRect();
    return !(a.top > b.bottom || a.right < b.left || a.bottom < b.top || a.left > b.right);
}

function inBounds({x, y}: PointerEvent, element?: HTMLElement | null) {
    if (!element) {
        return false;
    }
    const {top, left, bottom, right} = element.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
}

export const Slider = (props: SliderProps) => {
    // noinspection JSUnusedLocalSymbols
    const focusController = fc;
    const [componentProps,] = splitProps(props, [
        'disabled',
        'disableFocusRings',
        'labeled',
        'max',
        'min',
        'ranged',
        'step',
        'ticks',
        'valueStart',
        'valueEnd',
        'valueStartLabel',
        'valueEndLabel',
    ]);

    const max = createMemo(() => componentProps.max || 100);
    const min = createMemo(() => componentProps.min || 0);
    const ranged = createMemo(() => componentProps?.ranged || false);
    const step = createMemo(() => componentProps?.step || 1);
    const range = createMemo(() => Math.max(max() - min(), step()));
    const [action, setAction] = createSignal<Action | undefined>();

    const [state, setState] = createSignal<SliderState>({
            handleStart: {
                hover: false,
                label: componentProps.valueStartLabel,
            },
            handleEnd: {
                hover: false,
                label: componentProps.valueEndLabel,
            },
            inputStart: {
                value: componentProps.valueStart,
                label: componentProps.valueStartLabel,
            },
            inputEnd: {
                value: componentProps.valueEnd,
                label: componentProps.valueEndLabel,
            },
            isOverlapping: false,
            startOnTop: false,
        }
    );
    const handleStart = createMemo(() => state().handleStart);
    const handleEnd = createMemo(() => state().handleEnd);
    const inputStart = createMemo(() => state().inputStart)
    const inputEnd = createMemo(() => state().inputEnd)

    const startFraction = createMemo(
        () => ranged() ? ((inputStart().value ?? min()) - min()) / range() : 0
    );
    const endFraction = createMemo(
        () => ((inputEnd().value ?? min()) - min()) / range()
    );

    const [isRedispatchingEvent, setIsRedispatchingEvent] = createSignal(false);

    let sliderElement: HTMLDivElement | null = null;
    let inputStartElement: HTMLInputElement | null = null;
    let handleStartElement: HTMLDivElement | null = null;
    let inputEndElement: HTMLInputElement | null = null;
    let handleEndElement: HTMLDivElement | null = null;

    const containerStyles = createMemo(() => ({
            // for clipping inputs and active track.
            '--slider-start-fraction': String(startFraction()),
            '--slider-end-fraction': String(endFraction()),
            // for generating tick marks
            '--slider-tick-count': String(range() / step()),
        })
    );

    const handleStartRipple = createRippleEventEmitter();
    const handleStartRippleHandler = createHandlers(handleStartRipple.emit);
    const handleEndRipple = createRippleEventEmitter();
    const handleEndRippleHandler = createHandlers(handleEndRipple.emit);

    const handleFocus = (e: FocusEvent) => {
        const targetElement = e.target as HTMLInputElement;
        if (targetElement.classList.contains('start')) {
            setState({
                ...state(),
                startOnTop: true,
            });
        }
    }

    const startAction = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const fixed = (target === inputStartElement) ? inputEndElement! : inputStartElement!;
        setAction({
            canFlip: e.type === 'pointerdown',
            flipped: false,
            target,
            fixed,
            values: new Map([[target, target.valueAsNumber], [fixed, fixed?.valueAsNumber]])
        });
    }

    const handlePointerDown = (e: PointerEvent) => {
        startAction(e);
        const isStart = e.target as HTMLInputElement === inputStartElement;
        setState({
            ...state(),
            handleStart: {
                ...state().handleStart,
                hover: !componentProps.disabled && isStart && !!handleStartElement
            },
            handleEnd: {
                ...state().handleEnd,
                hover: !componentProps.disabled && !isStart && !!handleEndElement
            },
        });
    }

    const handlePointerUp = async () => {
        const {target, values, flipped} = action() ?? {};
        //  Async here for Firefox because input can be after pointerup
        //  when value is calmped.
        await new Promise(requestAnimationFrame);
        if (target !== undefined) {
            // Ensure Safari focuses input so label renders.
            // Ensure any flipped input is focused so the tab order is right.
            target.focus();
            // When action is flipped, change must be fired manually since the
            // real event target did not change.
            if (flipped && target.valueAsNumber !== values!.get(target)!) {
                target.dispatchEvent(new Event('change', {bubbles: true}));
            }
        }
        setAction(undefined);
    }

    const handlePointerMove = (e: PointerEvent) => {
        setState({
            ...state(),
            handleStart: {
                ...state().handleStart,
                hover: !componentProps.disabled && inBounds(e, handleStartElement)
            },
            handleEnd: {
                ...state().handleEnd,
                hover: !componentProps.disabled && inBounds(e, handleEndElement)
            },
            isOverlapping: !componentProps.disabled && isOverlapping(handleStartElement, handleEndElement),
        });
    }

    const handlePointerEnter = (e: PointerEvent) => {
        handlePointerMove(e);
    }

    const handlePointerLeave = () => {
        setState({
            ...state(),
            handleStart: {
                ...state().handleStart,
                hover: false,
            },
            handleEnd: {
                ...state().handleEnd,
                hover: false,
            },
        });
    }

    const handleKeydown = (e: KeyboardEvent) => {
        startAction(e);
    }

    const handleKeyup = () => {
        setAction(undefined);
    }

    const needsClamping = () => {
        const {target, fixed} = action();
        const isStart = target === inputStartElement;
        return isStart ? target.valueAsNumber > fixed.valueAsNumber : target.valueAsNumber < fixed.valueAsNumber;
    }

    const isActionFlipped = () => {
        const {target, fixed, values} = action();
        if (action().canFlip) {
            const coincident = values.get(target) === values.get(fixed);
            if (coincident && needsClamping()) {
                setAction({
                    ...action(),
                    canFlip: false,
                    flipped: true,
                    target: fixed,
                    fixed: target,
                })
            }
        }
        return action().flipped;
    }

    const flipAction = () => {
        const {target, fixed, values} = action();
        const changed = target.valueAsNumber !== fixed.valueAsNumber;
        target.valueAsNumber = fixed.valueAsNumber;
        fixed.valueAsNumber = values.get(fixed)!;
        return changed;
    }

    const clampAction = () => {
        if (!needsClamping()) {
            return false;
        }
        const {target, fixed} = action();
        target.valueAsNumber = fixed.valueAsNumber;
        return true;
    }

    const updateOnTop = (input: HTMLInputElement) => {
        setState({
            ...state(),
            startOnTop: input.classList.contains('start'),
        });
    }

    const handleInput = (e: InputEvent) => {
        // avoid processing a re-dispatched event
        if (isRedispatchingEvent()) {
            return;
        }
        let stopPropagation = false, redispatch = false;
        if (ranged()) {
            if (isActionFlipped()) {
                stopPropagation = true;
                redispatch = flipAction();
            }
            if (clampAction()) {
                stopPropagation = true;
                redispatch = false;
            }
        }
        const {target} = action();
        updateOnTop(target);
        // update value only on interaction
        if (ranged()) {
            setState({
                ...state(),
                inputStart: {
                    ...state().inputStart,
                    value: inputStartElement!.valueAsNumber
                },
                inputEnd: {
                    ...state().inputEnd,
                    value: inputEndElement!.valueAsNumber
                }
            });
        } else {
            setState({
                ...state(),
                inputEnd: {
                    ...state().inputEnd,
                    value: inputEndElement!.valueAsNumber
                }
            });
        }
        // control external visibility of input event
        if (stopPropagation) {
            e.stopPropagation();
        }
        // ensure event path is correct when flipped.
        if (redispatch) {
            setIsRedispatchingEvent(true);
            redispatchEvent(target, e);
            setIsRedispatchingEvent(false);
        }
    }

    const handleChange = (e: Event) => {
        // prevent keyboard triggered changes from dispatching for
        // clamped values; note, this only occurs for keyboard
        const changeTarget = e.target as HTMLInputElement;
        const {target, values} = action() ?? {};
        const squelch = (target && (target.valueAsNumber === values!.get(changeTarget)!));
        if (!squelch) {
            redispatchEvent(sliderElement, e);
        }
        // ensure keyboard triggered change clears action.
        setAction(undefined);
    }

    onMount(() => {
        sliderElement.addEventListener('click', (event: MouseEvent) => {
            if (!isActivationClick(event) || !inputEndElement) {
                return;
            }
            focus();
            dispatchActivationClick(inputEndElement);
        });
    });

    return (
        <div
            ref={sliderElement}
            class={'slider__wrapper'}
            classList={{
                'disabled': componentProps.disabled,
            }}
        >
            <div
                class="container"
                classList={{
                    'ranged': ranged(),
                }}
                style={containerStyles()}
            >
                <Show when={ranged()}>
                    <input
                        id={'start'}
                        ref={inputStartElement}
                        class={'start'}
                        name={'start'}
                        type={'range'}
                        onFocus={handleFocus}
                        onPointerDown={
                            composeEventHandlers([
                                handlePointerDown,
                                handleStartRippleHandler.onPointerDown
                            ])
                        }
                        onPointerUp={
                            composeEventHandlers([
                                handlePointerUp,
                                handleStartRippleHandler.onPointerUp
                            ])
                        }
                        onPointerEnter={
                            composeEventHandlers([
                                handlePointerEnter,
                                handleStartRippleHandler.onPointerEnter
                            ])
                        }
                        onPointerMove={handlePointerMove}
                        onPointerLeave={
                            composeEventHandlers([
                                handlePointerLeave,
                                handleStartRippleHandler.onPointerLeave
                            ])
                        }
                        onKeyDown={handleKeydown}
                        onKeyUp={handleKeyup}
                        onInput={handleInput}
                        onChange={handleChange}
                        disabled={componentProps.disabled}
                        min={min()}
                        max={max()}
                        step={step()}
                        value={inputStart().value}
                        tabIndex={1}
                        aria-label={state().inputStart.label}
                        aria-valuetext={componentProps.valueStartLabel || String(state().inputStart.value)}
                    />
                </Show>
                <input
                    id={'end'}
                    ref={inputEndElement}
                    class={'end'}
                    type={'range'}
                    name={'end'}
                    onFocus={handleFocus}
                    onPointerDown={
                        composeEventHandlers([
                            handlePointerDown,
                            handleEndRippleHandler.onPointerDown
                        ])
                    }
                    onPointerUp={
                        composeEventHandlers([
                            handlePointerUp,
                            handleEndRippleHandler.onPointerUp
                        ])
                    }
                    onPointerEnter={
                        composeEventHandlers([
                            handlePointerEnter,
                            handleEndRippleHandler.onPointerEnter
                        ])
                    }
                    onPointerMove={handlePointerMove}
                    onPointerLeave={
                        composeEventHandlers([
                            handlePointerLeave,
                            handleEndRippleHandler.onPointerLeave
                        ])
                    }
                    onKeyDown={handleKeydown}
                    onKeyUp={handleKeyup}
                    onInput={handleInput}
                    onChange={handleChange}
                    disabled={componentProps.disabled}
                    min={min()}
                    max={max()}
                    step={step()}
                    value={inputEnd().value}
                    tabIndex={0}
                    aria-label={inputEnd().label}
                    aria-valuetext={componentProps.valueEndLabel || String(inputEnd().value)}
                />
                <div
                    class={'track'}
                    classList={{
                        'tickmarks': componentProps.ticks,
                    }}
                />
                <div
                    class={'handleContainerPadded'}
                >
                    <div class={'handleContainerBlock'}>
                        <div
                            class={'handleContainer'}
                            classList={{
                                'hover': state().handleStart.hover || state().handleEnd.hover,
                            }}
                        >
                            <Show when={ranged()}>
                                <div
                                    ref={handleStartElement}
                                    {...handleStartRippleHandler}
                                    use:focusController={{
                                        disabled: componentProps.disableFocusRings,
                                    }}
                                    class={'handle start'}
                                    classList={{
                                        'hover': handleStart().hover,
                                        'onTop': !componentProps.disabled && state().startOnTop,
                                        'isOverlapping': state().isOverlapping,
                                    }}
                                >
                                    <div class={'handleNub'}><Elevation/></div>
                                    <Show when={componentProps.labeled}>
                                        <div class="label">
                                                <span
                                                    class="labelContent"
                                                    part="label"
                                                >
                                                    {componentProps.valueStartLabel || inputStart().value}
                                                </span>
                                        </div>
                                    </Show>
                                    <Ripple
                                        disabled={componentProps.disabled}
                                        listen={handleStartRipple.listen}
                                        rippleClass={'start'}
                                    />
                                </div>
                            </Show>
                            <div
                                ref={handleEndElement}
                                {...handleEndRippleHandler}
                                use:focusController={{
                                    disabled: componentProps.disableFocusRings,
                                }}
                                class={'handle end'}
                                classList={{
                                    'hover': handleEnd().hover,
                                    'isOverlapping': state().isOverlapping,
                                }}
                            >
                                <div class={'handleNub'}><Elevation/></div>
                                <Show when={componentProps.labeled}>
                                    <div class="label">
                                        <span class="labelContent"
                                              part="label">{componentProps.valueEndLabel || inputEnd().value}</span>
                                    </div>
                                </Show>
                                <Ripple
                                    disabled={componentProps.disabled}
                                    listen={handleEndRipple.listen}
                                    rippleClass={'end'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
