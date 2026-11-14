<script setup lang="ts">
import { useTimeoutFn } from "@vueuse/core";
import { computed, defineAsyncComponent, type Component } from "vue";
import { Sheet, SheetContent } from "@/shared/ui/sheet";
import { useSheetsStore, type SheetKind } from "@/stores/sheets";
import PhotoLightbox from "./PhotoLightbox.vue";

type ContentKind = Exclude<SheetKind, "photo">;
type Loader = () => Promise<{ default: Component }>;

const lazy = (load: Loader) => ({ load, component: defineAsyncComponent(load) });

/** Lazy registry: sheet kind → its content component (each renders its own SheetTitle) */
const SHEETS: Record<ContentKind, ReturnType<typeof lazy>> = {
  settings: lazy(() => import("@/features/settings/SettingsSheet.vue")),
  note: lazy(() => import("@/features/notes/NoteSheet.vue")),
  shop: lazy(() => import("@/features/home/ShopSheet.vue")),
  sos: lazy(() => import("@/features/care/SosSheet.vue")),
  breath: lazy(() => import("@/features/care/BreathSheet.vue")),
  talk: lazy(() => import("@/features/care/TalkSheet.vue")),
  coat: lazy(() => import("@/features/coats/CoatSheet.vue")),
};

/**
 * Fetch every sheet once the app has settled, so a sheet never slides in empty
 * and then jumps in height when its chunk arrives.
 */
const PREFETCH_MS = 2500;
useTimeoutFn(
  () => Object.values(SHEETS).forEach((s) => void s.load().catch(() => {})),
  PREFETCH_MS,
);

const sheets = useSheetsStore();
const open = computed(() => !!sheets.current && sheets.current.kind !== "photo");

/** Keeps the last sheet's content while it slides away, so it doesn't collapse mid-animation */
type Shown = { component: Component; props: object };
const shown = computed<Shown | null>((prev) => {
  const c = sheets.current;
  if (!c || c.kind === "photo") return prev ?? null;
  return { component: SHEETS[c.kind].component, props: c.props ?? {} };
});
const photo = computed(() => (sheets.current?.kind === "photo" ? sheets.current.props.url : null));

function onOpenChange(next: boolean) {
  if (!next) sheets.close();
}
</script>

<template>
  <Sheet :open @update:open="onOpenChange">
    <SheetContent :aria-describedby="undefined">
      <component :is="shown.component" v-if="shown" v-bind="shown.props" />
    </SheetContent>
  </Sheet>
  <PhotoLightbox :url="photo" @close="sheets.close()" />
</template>
