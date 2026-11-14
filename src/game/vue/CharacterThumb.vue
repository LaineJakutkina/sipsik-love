<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import type { ItemId, Worn } from "@/domain/items";
import type { MoodId } from "@/domain/moods";
import { characterThumb, faceThumb, itemThumb, type ArtFrame } from "../character/compose";
import { thumbnails } from "../thumbnails/ThumbnailRenderer";

type Props =
  | { kind: "face"; mood: MoodId; coat?: string; width?: number }
  | { kind: "item"; item: ItemId; coat?: string; width?: number }
  | { kind: "full"; mood: MoodId; coat?: string; worn?: Worn; width?: number };

const props = defineProps<Props>();

const spec = computed((): { key: string; frame: () => ArtFrame } => {
  const p = props;
  switch (p.kind) {
    case "face":
      return { key: `face:${p.mood}:${p.coat}`, frame: () => faceThumb(p.mood, p.coat) };
    case "item":
      return {
        key: `item:${p.item}:${p.item === "kitten" ? p.coat : ""}`,
        frame: () => itemThumb(p.item, p.coat),
      };
    case "full": {
      const worn = p.worn ?? {};
      return {
        key: `full:${p.mood}:${p.coat}:${JSON.stringify(worn)}`,
        frame: () => characterThumb({ mood: p.mood, coat: p.coat, worn }),
      };
    }
    default: {
      const _exhaustive: never = p;
      return _exhaustive;
    }
  }
});

const src = ref<string>();
/** The art had to be drawn first, so it fades in rather than popping over its placeholder */
const late = ref(false);
watchEffect((onCleanup) => {
  let live = true;
  onCleanup(() => (live = false));
  const { key, frame } = spec.value;
  const width = props.width ?? 96;
  const drawn = thumbnails.peek(key, width);
  if (drawn) {
    src.value = drawn;
    return;
  }
  thumbnails
    .render(key, frame, width)
    .then((url) => {
      if (!live) return;
      late.value = !src.value;
      src.value = url;
    })
    .catch((e: unknown) => console.warn("thumbnail failed", key, e));
});
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :class="[
      kind === 'face' && 'rounded-full',
      late && 'animate-in fade-in-0 duration-200 ease-out-soft',
    ]"
    alt=""
    aria-hidden="true"
    draggable="false"
  />
  <span v-else :class="kind === 'face' && 'rounded-full'" aria-hidden="true" />
</template>
