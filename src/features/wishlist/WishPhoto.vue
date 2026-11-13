<script setup lang="ts">
import { CameraIcon } from "@lucide/vue";
import { computed } from "vue";
import type { Wish } from "@/domain/types";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useWishes } from "./useWishes";

/**
 * Full-bleed media of a wish card: the photo (tap to open, camera to replace),
 * an “add photo” picker or a placeholder. Fixed height, not `aspect-ratio`: iOS Safari
 * sizes grid rows from aspect-ratio boxes at the wrong width and leaves cards half empty.
 * The image is absolutely positioned, so its natural size never affects the card.
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
  <div class="bg-muted relative h-36 w-full shrink-0">
    <template v-if="wish.thumb_url">
      <button
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
      <Button
        as="label"
        variant="ghost"
        size="icon-sm"
        class="bg-paper/90 text-foreground absolute right-2 bottom-2 size-8 shadow-sm"
        aria-label="Заменить фото"
      >
        <CameraIcon class="size-4" :stroke-width="2.2" />
        <input type="file" accept="image/*" class="sr-only" @change="onFile" />
      </Button>
    </template>
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
  </div>
</template>
