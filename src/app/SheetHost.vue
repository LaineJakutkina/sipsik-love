<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";
import { Sheet, SheetContent } from "@/shared/ui/sheet";
import { useSheetsStore, type SheetKind } from "@/stores/sheets";
import PhotoLightbox from "./PhotoLightbox.vue";

/** Lazy registry: sheet kind → its content component (each renders its own SheetTitle) */
const SHEETS: Record<Exclude<SheetKind, "photo">, Component> = {
  settings: defineAsyncComponent(() => import("@/features/settings/SettingsSheet.vue")),
  note: defineAsyncComponent(() => import("@/features/notes/NoteSheet.vue")),
  shop: defineAsyncComponent(() => import("@/features/home/ShopSheet.vue")),
  sos: defineAsyncComponent(() => import("@/features/care/SosSheet.vue")),
  breath: defineAsyncComponent(() => import("@/features/care/BreathSheet.vue")),
  talk: defineAsyncComponent(() => import("@/features/care/TalkSheet.vue")),
  coat: defineAsyncComponent(() => import("@/features/coats/CoatSheet.vue")),
};

const sheets = useSheetsStore();
const sheet = computed(() => {
  const c = sheets.current;
  return c && c.kind !== "photo" ? { component: SHEETS[c.kind], props: c.props ?? {} } : null;
});
const photo = computed(() => (sheets.current?.kind === "photo" ? sheets.current.props.url : null));

function onOpenChange(open: boolean) {
  if (!open) sheets.close();
}
</script>

<template>
  <Sheet :open="!!sheet" @update:open="onOpenChange">
    <SheetContent :aria-describedby="undefined">
      <component :is="sheet.component" v-if="sheet" v-bind="sheet.props" />
    </SheetContent>
  </Sheet>
  <PhotoLightbox :url="photo" @close="sheets.close()" />
</template>
