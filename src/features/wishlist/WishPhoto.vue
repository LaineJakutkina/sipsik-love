<script setup lang="ts">
import { computed } from "vue";
import type { Wish } from "@/domain/types";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { Badge } from "@/shared/ui/badge";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useWishes } from "./useWishes";

/** Square photo on top of a wish card: the photo, a placeholder, or an “add photo” picker */
const props = defineProps<{ wish: Wish; mine: boolean }>();
const session = useSessionStore();
const sheets = useSheetsStore();
const wishes = useWishes();

const badge = computed(() =>
  props.wish.done ? "Сбылось" : !props.mine && props.wish.reserved_by_me ? "Дарю я" : null,
);
const mode = computed(() =>
  props.wish.thumb_url ? "photo" : wishes.photosFull(props.wish.owner) ? "full" : "add",
);
const tag = computed(() => ({ photo: "button", full: "div", add: "label" })[mode.value]);

function open() {
  if (mode.value === "photo" && props.wish.photo_url)
    sheets.open("photo", { url: props.wish.photo_url });
}
function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) void wishes.uploadPhoto(props.wish.id, file);
}
</script>

<template>
  <component
    :is="tag"
    :type="tag === 'button' ? 'button' : undefined"
    :aria-label="mode === 'photo' ? 'Открыть фото' : mode === 'add' ? 'Добавить фото' : undefined"
    class="bg-muted border-primary relative block aspect-square max-w-full cursor-pointer overflow-hidden border-b-2 p-0"
    @click="open"
  >
    <img
      v-if="wish.thumb_url"
      :src="wish.thumb_url"
      :alt="wish.title"
      loading="lazy"
      class="block size-full object-cover text-[0px] text-transparent"
    />
    <span
      v-else
      class="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-xs font-bold"
    >
      <CharacterThumb
        kind="face"
        mood="neutral"
        :coat="session.app.couple.coat"
        :width="54"
        class="size-[54px] opacity-90"
      />
      {{ mode === "add" ? "+ фото" : "без фото" }}
    </span>
    <input v-if="mode === 'add'" type="file" accept="image/*" class="sr-only" @change="onFile" />
    <Badge v-if="badge" variant="secondary" size="sm" class="absolute top-2 left-2">
      {{ badge }}
    </Badge>
  </component>
</template>
