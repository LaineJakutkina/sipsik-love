/**
 * Small Web Animations helpers for things CSS classes can't do alone: animating
 * to and from an element's natural height. Curves match the `ease-*` tokens in
 * `main.css`. Every helper finishes instantly when the system asks for less motion.
 */
export const EASE_OUT_SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const EASE_IN_QUICK = "cubic-bezier(0.4, 0, 1, 1)";

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function run(el: Element, frames: Keyframe[], options: KeyframeAnimationOptions, done: () => void) {
  if (reducedMotion()) {
    done();
    return;
  }
  el.animate(frames, { fill: "none", ...options }).onfinish = done;
}

/** The box with its vertical padding, border and margin, as WAAPI keyframe values */
function box(el: HTMLElement): Keyframe {
  const s = getComputedStyle(el);
  return {
    height: `${el.offsetHeight}px`,
    paddingTop: s.paddingTop,
    paddingBottom: s.paddingBottom,
    marginTop: s.marginTop,
    marginBottom: s.marginBottom,
    borderTopWidth: s.borderTopWidth,
    borderBottomWidth: s.borderBottomWidth,
    overflow: "hidden",
  };
}

/**
 * Folded to nothing. In a flex / grid column the gap next to the element is folded
 * too (a negative margin eats it), so the neighbours end exactly where they'll stay.
 */
function flat(el: HTMLElement): Keyframe {
  const parent = el.parentElement;
  const gap = parent ? parseFloat(getComputedStyle(parent).rowGap) || 0 : 0;
  const eat = `${-gap}px`;
  return {
    height: "0px",
    paddingTop: "0px",
    paddingBottom: "0px",
    marginTop: !el.nextElementSibling && el.previousElementSibling ? eat : "0px",
    marginBottom: el.nextElementSibling ? eat : "0px",
    borderTopWidth: "0px",
    borderBottomWidth: "0px",
    overflow: "hidden",
  };
}

/** Grows from nothing to its natural height; whatever is below slides down */
export function expand(el: HTMLElement, done: () => void) {
  run(
    el,
    [
      { ...flat(el), opacity: 0 },
      { ...box(el), opacity: 1 },
    ],
    { duration: 260, easing: EASE_OUT_SOFT },
    done,
  );
}

/** Folds away to nothing; whatever is below slides up into its place */
export function collapse(el: HTMLElement, done: () => void) {
  run(
    el,
    [
      { ...box(el), opacity: 1 },
      { opacity: 0, offset: 0.4 },
      { ...flat(el), opacity: 0 },
    ],
    { duration: 200, easing: EASE_IN_QUICK },
    done,
  );
}

/**
 * Leave hook for view swaps: the old view goes at once, so the new one takes its place
 * in the same frame. A fade-out first would leave an empty frame (and a collapsed
 * header) between the two — that reads as a flicker.
 */
export function leaveAtOnce(_el: Element, done: () => void) {
  done();
}

/** Appears in place: a fade with a small rise, or a small zoom for tiles in a grid */
export function appear(el: HTMLElement, done: () => void, tile = false) {
  const from = tile ? "scale(0.92)" : "translateY(-6px)";
  run(
    el,
    [
      { opacity: 0, transform: from },
      { opacity: 1, transform: "none" },
    ],
    { duration: 220, easing: EASE_OUT_SOFT },
    done,
  );
}
