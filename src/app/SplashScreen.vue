<script setup lang="ts">
import { usePreferredReducedMotion, useTimeoutFn } from "@vueuse/core";
import { computed, onMounted } from "vue";
import SplashStage from "@/game/vue/SplashStage.vue";
import { useSessionStore } from "@/stores/session";

/**
 * Intro on every launch: the cat drives by in its truck, mice chasing it. Tap to
 * skip; skipped entirely when the system asks for less motion. A timeout ends it
 * even if WebGL never starts.
 */
const emit = defineEmits<{ done: [] }>();
const session = useSessionStore();
const motion = usePreferredReducedMotion();

const SAFETY_MS = 4500;

/** Saved state from the last visit, so the user's own cat drives by */
const look = computed(() => ({
  mood: "happy" as const,
  coat: session.state?.couple?.coat,
  worn: session.state?.couple?.worn ?? {},
}));

let ended = false;
function end() {
  if (ended) return;
  ended = true;
  emit("done");
}

useTimeoutFn(end, SAFETY_MS);
onMounted(() => {
  if (motion.value === "reduce") end();
});
</script>

<template>
  <button
    type="button"
    class="bg-primary text-primary-foreground fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-2"
    aria-label="Пропустить заставку"
    @click="end"
  >
    <span class="animate-in fade-in slide-in-from-bottom-2 text-[34px] font-extrabold duration-500">
      Сипсик <em class="text-secondary not-italic">Love</em>
    </span>
    <span class="block h-[38vh] w-full max-w-[520px]">
      <SplashStage :look @done="end" />
    </span>
  </button>
</template>
