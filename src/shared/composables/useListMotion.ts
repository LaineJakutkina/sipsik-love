import { appear, collapse } from "@/shared/lib/motion";

type Done = () => void;
type Leaving = { el: Element; done: Done };

/** A row's identity for spotting the optimistic → saved swap; buttons differ between the two */
function keyOf(el: Element) {
  let text = el.textContent ?? "";
  for (const b of el.querySelectorAll("button")) text = text.replace(b.textContent ?? "", "");
  return text.trim();
}

/**
 * Enter / leave hooks for a `TransitionGroup` list.
 *
 * New rows fade in and the rows below glide down (the group's move class); removed
 * rows fold away and the rest slide up. In a `grid` a removed tile leaves at once so
 * its neighbours can glide into the gap.
 *
 * An optimistic row is replaced by the server's copy with a new id, i.e. a new key.
 * When a row leaves and a row with the same text enters in the same update, it's that
 * swap: both happen instantly, so saved rows don't blink.
 */
export function useListMotion(grid: () => boolean) {
  /** Rows that left during the current update, by text; settled on the next microtask */
  let leaving: Leaving[] = [];
  const twins = new WeakSet<Element>();

  function settle() {
    const rest = leaving;
    leaving = [];
    for (const { el, done } of rest) {
      if (!grid() && el instanceof HTMLElement) collapse(el, done);
      else done();
    }
  }

  function onLeave(el: Element, done: Done) {
    if (!leaving.length) queueMicrotask(settle);
    if (grid()) {
      done();
      leaving.push({ el, done: () => {} });
    } else {
      leaving.push({ el, done });
    }
  }

  function onBeforeEnter(el: Element) {
    const key = keyOf(el);
    const i = leaving.findIndex((x) => keyOf(x.el) === key);
    const twin = leaving[i];
    if (!twin) return;
    leaving.splice(i, 1);
    twin.done();
    twins.add(el);
  }

  function onEnter(el: Element, done: Done) {
    if (twins.has(el) || !(el instanceof HTMLElement)) {
      twins.delete(el);
      done();
      return;
    }
    appear(el, done, grid());
  }

  return { onLeave, onBeforeEnter, onEnter };
}
