import {Accessor, createSignal, JSX, Setter} from "solid-js";

/**
 * A corner of a box in the standard logical property style of <block>_<inline>
 */
export type Corner = 'END_START' | 'END_END' | 'START_START' | 'START_END';

export type SurfacePositionHelperProps = {
  anchorCorner: Corner;
  menuCorner: Corner;
  surfaceEl: () => HTMLElement | null;
  anchorEl: () => HTMLElement;
  isTopLayer: boolean;
  isOpen: Accessor<boolean>;
  xOffset: number;
  yOffset: number;
}

export class SurfacePositionHelper {
  private surfaceStylesInternal: Accessor<JSX.CSSProperties>;
  private setSurfaceStylesInternal: Setter<JSX.CSSProperties>;
  private containerStylesInternal: Accessor<JSX.CSSProperties>;
  private setContainerStylesInternal: Setter<JSX.CSSProperties>;

  constructor(
    readonly props: SurfacePositionHelperProps,
  ) {
    [this.surfaceStylesInternal, this.setSurfaceStylesInternal] = createSignal<JSX.CSSProperties>({
      display: 'none',
    });
    [this.containerStylesInternal, this.setContainerStylesInternal] = createSignal<JSX.CSSProperties>({
      display: 'none',
    });
  }

  async position() {
    const {
      surfaceEl: surfacElRaw,
      anchorEl: anchorElRaw,
      anchorCorner: anchorCornerRaw,
      menuCorner: surfaceCornerRaw,
      isTopLayer: topLayerRaw,
      xOffset,
      yOffset,
    } = this.props;
    const anchorCorner = anchorCornerRaw.toUpperCase().trim();
    const surfaceCorner = surfaceCornerRaw.toUpperCase().trim();

    const surfaceEl = surfacElRaw();
    const anchorEl = anchorElRaw();

    if (!surfaceEl || !anchorEl) {
      return;
    }

    this.setContainerStylesInternal({
      top: `${anchorEl.getBoundingClientRect().top}px` || undefined,
      right: `${anchorEl.getBoundingClientRect().right}px` || undefined,
      bottom: `${anchorEl.getBoundingClientRect().bottom}px` || undefined,
      left: `${anchorEl.getBoundingClientRect().left}px` || undefined,
      width: `${anchorEl.getBoundingClientRect().width}px` || undefined,
      height: `${anchorEl.getBoundingClientRect().height}px` || undefined,
      display: 'block',
    })


    // Paint the surface transparently so that we can get the position and the
    // rect info of the surface.
    this.setSurfaceStylesInternal({
      'display': 'block',
      'opacity': '0',
    });

    const surfaceRect = surfaceEl.getBoundingClientRect();
    const anchorRect = anchorEl.getBoundingClientRect();
    const [surfaceBlock, surfaceInline] = surfaceCorner.split('_') as Array<'START' | 'END'>;
    const [anchorBlock, anchorInline] = anchorCorner.split('_') as Array<'START' | 'END'>;


    // We use number booleans to multiply values rather than `if` / ternary
    // statements because it _heavily_ cuts down on nesting and readability
    const isTopLayer = topLayerRaw ? 1 : 0;
    // LTR depends on the direction of the SURFACE not the anchor.
    const isLTR = getComputedStyle(surfaceEl as HTMLElement).direction === 'ltr' ? 1 : 0;
    const isRTL = isLTR ? 0 : 1;
    const isSurfaceInlineStart = surfaceInline === 'START' ? 1 : 0;
    const isSurfaceInlineEnd = surfaceInline === 'END' ? 1 : 0;
    const isSurfaceBlockStart = surfaceBlock === 'START' ? 1 : 0;
    const isSurfaceBlockEnd = surfaceBlock === 'END' ? 1 : 0;
    const isOneInlineEnd = anchorInline !== surfaceInline ? 1 : 0;
    const isOneBlockEnd = anchorBlock !== surfaceBlock ? 1 : 0;
    // log is one block end

    /*
     * A diagram that helps describe some of the variables used in the following
     * calculations.
     *
     * ┌───── inline/blockTopLayerOffset
     * │       │
     * │     ┌─▼───┐                  Window
     * │    ┌┼─────┴────────────────────────┐
     * │    ││                              │
     * └──► ││  ┌──inline/blockAnchorOffset │
     *      ││  │     │                     │
     *      └┤  │  ┌──▼───┐                 │
     *       │  │ ┌┼──────┤                 │
     *       │  └─►│Anchor│                 │
     *       │    └┴──────┘                 │
     *       │                              │
     *       │     ┌────────────────────────┼────┐
     *       │     │ Surface                │    │
     *       │     │                        │    │
     *       │     │                        │    │
     *       │     │                        │    │
     *       │     │                        │    │
     *       │     │                        │    │
     *       └─────┼────────────────────────┘    ├┐
     *             │ inline/blockOOBCorrection   ││
     *             │                         │   ││
     *             │                         ├──►││
     *             │                         │   ││
     *             └────────────────────────┐▼───┼┘
     *                                      └────┘
     */

    // Whether or not to apply the width of the anchor
    const inlineAnchorOffset = isOneInlineEnd * anchorRect.width + xOffset;
    // The inline position of the anchor relative to window in LTR
    const inlineTopLayerOffsetLTR = isSurfaceInlineStart * anchorRect.left +
      isSurfaceInlineEnd * (window.innerWidth - anchorRect.right);
    // The inline position of the anchor relative to window in RTL
    const inlineTopLayerOffsetRTL =
      isSurfaceInlineStart * (window.innerWidth - anchorRect.right) +
      isSurfaceInlineEnd * anchorRect.left;
    // The inline position of the anchor relative to window
    const inlineTopLayerOffset =
      isLTR * inlineTopLayerOffsetLTR + isRTL * inlineTopLayerOffsetRTL;
    // If the surface's inline would be out of bounds of the window, move it
    // back in
    const inlineOutOfBoundsCorrection = Math.min(
      0,
      window.innerWidth - inlineTopLayerOffset - inlineAnchorOffset -
      surfaceRect.width);

    // The inline logical value of the surface
    const inline = isTopLayer * inlineTopLayerOffset + inlineAnchorOffset +
      inlineOutOfBoundsCorrection;

    // Whether or not to apply the height of the anchor
    const blockAnchorOffset = isOneBlockEnd * anchorRect.height + yOffset;
    // The absolute block position of the anchor relative to window
    const blockTopLayerOffset = isSurfaceBlockStart * anchorRect.top
      + isSurfaceBlockEnd * (window.innerHeight - anchorRect.bottom);
    // If the surface's block would be out of bounds of the window, move it back
    // in
    const blockOutOfBoundsCorrection = Math.min(
      0,
      window.innerHeight - blockTopLayerOffset - blockAnchorOffset - surfaceRect.height);

    // The block logical value of the surface
    const block = isTopLayer * blockTopLayerOffset + blockAnchorOffset + blockOutOfBoundsCorrection;

    const surfaceBlockProperty = surfaceBlock === 'START' ? 'inset-block-start' : 'inset-block-end';

    const surfaceInlineProperty = surfaceInline === 'START' ? 'inset-inline-start' : 'inset-inline-end';

    this.setSurfaceStylesInternal({
      'display': 'block',
      'opacity': '1',
      [surfaceBlockProperty]: `${block}px`,
      [surfaceInlineProperty]: `${inline}px`,
    });
  }

  close() {
    this.setContainerStylesInternal({
      'display': 'none',
    });
    this.setSurfaceStylesInternal({
      'display': 'none',
    });
  }

  get surfaceStyles() {
    return this.surfaceStylesInternal;
  }

  get containerStyles() {
    return this.containerStylesInternal;
  }
}
