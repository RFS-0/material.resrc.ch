export function getLabelKeyframes(floatingLabel: HTMLElement, restingLabel: HTMLElement, type: 'floatToRest' | 'restToFloat'): Keyframe[] {
  const {
    x: floatingX,
    y: floatingY,
    width: floatingWidth,
    height: floatingHeight
  } = floatingLabel.getBoundingClientRect();
  const {
    x: restingX,
    y: restingY,
    width: restingWidth,
    height: restingHeight
  } = restingLabel.getBoundingClientRect();
  // Scale by width ratio instead of font size since letter-spacing will scale
  // incorrectly. Using the width we can better approximate the adjusted
  // scale and compensate for tracking.
  const scale = floatingWidth / restingWidth;
  const xDelta = floatingX - restingX;
  // The line-height of the resting and floating label are different. When
  // we move the resting label up to the floating label's position, it won't
  // exactly match because of this. We need to adjust by half of what the
  // final scaled resting label's height will be.
  const yDelta = floatingY - restingY +
    Math.round((floatingHeight - restingHeight * scale) / 2);

  // Create the two transforms: resting to floating (using the calculations
  // above), and floating to resting (re-setting the transform to initial
  // values).
  const floatTransform = `translateX(${xDelta}px) translateY(calc(-50% + ${yDelta}px)) scale(${scale})`;
  const restTransform = `translateX(0) translateY(-50%) scale(1)`;

  if (type === 'restToFloat') {
    return [{ transform: restTransform }, { transform: floatTransform }];
  }

  if (type === 'floatToRest') {
    return [{ transform: floatTransform }, { transform: restTransform }];
  }
  throw Error('Invalid animation type');
}


