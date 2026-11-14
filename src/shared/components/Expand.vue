<script setup lang="ts">
import { collapse, expand } from "@/shared/lib/motion";

/**
 * Wraps one `v-if`-ed block (an inline form, a hint) so it unfolds to its height and
 * folds away, pushing the content below smoothly instead of making it jump.
 */
function onEnter(el: Element, done: () => void) {
  if (el instanceof HTMLElement) expand(el, done);
  else done();
}
function onLeave(el: Element, done: () => void) {
  if (el instanceof HTMLElement) collapse(el, done);
  else done();
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <slot />
  </Transition>
</template>
