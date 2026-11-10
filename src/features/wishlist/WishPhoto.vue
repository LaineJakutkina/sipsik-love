<script setup lang="ts">
import { computed } from "vue";
import type { Wish } from "@/domain/types";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { Badge } from "@/shared/ui/badge";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useWishes } from "./useWishes";

/**
 * Fixed 4:3 media area of a wish card: the photo, an “add photo” picker or a placeholder.
 * The image is absolutely positioned so its natural size can never stretch the card.
 * The `actions` slot renders over the top-right corner.
 */
const props = defineProps<{ wish: Wish; mine: boolean }>();
const session = useSessionStore();
const sheets = useSheetsStore();
const wishes = useWishes();

const badge = computed(() =>
  props.wish.done ? "Сбылось" : !props.mine && props.wish.reserved_by_me ? "Дарю я" : null,
);
const canAdd = computed(() => !wishes.photosFull(props.wish.owner));

function open() {
  if (props.wish.photo_url) sheets.open("photo", { url: props.wish.photo_url });
}
function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) void wishes.uploadPhoto(props.wish.id, file);
}
</script>

<template>
  <div class="bg-muted border-primary relative aspect-[4/3] w-full overflow-hidden border-b-2">
    <button
      v-if="wish.thumb_url"
      type="button"
      class="absolute inset-0 cursor-zoom-in"
      aria-label="Открыть фото"
      @click="open"
    >
      <img
        :src="wish.thumb_url"
        :alt="wish.title"
        loading="lazy"
        class="absolute inset-0 size-full object-cover"
      />
    </button>
    <component
      :is="canAdd ? 'label' : 'div'"
      v-else
      class="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-1 text-xs font-bold"
      :class="canAdd && 'cursor-pointer'"
    >
      <CharacterThumb
        kind="face"
        mood="neutral"
        :coat="session.app.couple.coat"
        :width="44"
        class="size-11 opacity-90"
      />
      {{ canAdd ? "+ фото" : "без фото" }}
      <input v-if="canAdd" type="file" accept="image/*" class="sr-only" @change="onFile" />
    </component>
    <Badge v-if="badge" variant="secondary" size="sm" class="absolute top-2 left-2">
      {{ badge }}
    </Badge>
    <div class="absolute top-2 right-2 flex gap-1.5">
      <slot name="actions" />
    </div>
  </div>
</template>
