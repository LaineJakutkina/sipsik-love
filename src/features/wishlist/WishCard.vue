<script setup lang="ts">
import { computed } from "vue";
import { safeUrl } from "@/domain/catalog";
import type { Wish } from "@/domain/types";
import { telegram } from "@/services/telegram";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useWishes } from "./useWishes";
import WishPhoto from "./WishPhoto.vue";

/** One wish in the grid; `armed` shows the delete confirmation instead of × */
const props = defineProps<{ wish: Wish; mine: boolean; armed: boolean }>();
const emit = defineEmits<{ arm: []; remove: [] }>();
const wishes = useWishes();

const reserved = computed(() => !props.mine && props.wish.reserved_by_me && !props.wish.done);
const link = computed(() => (props.wish.link ? safeUrl(props.wish.link) : null));

function openLink(e: MouseEvent) {
  e.preventDefault();
  if (link.value) telegram.openLink(link.value);
}
function onFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) void wishes.uploadPhoto(props.wish.id, file);
}
</script>

<template>
  <article
    :class="
      cn(
        'border-primary bg-card flex min-w-0 flex-col overflow-hidden rounded-[22px] border-2',
        wish.done && 'opacity-50',
        reserved && 'border-secondary ring-secondary ring-2',
      )
    "
  >
    <WishPhoto :wish :mine />
    <div class="flex min-w-0 flex-1 flex-col gap-1.5 px-3 pt-2.5 pb-3">
      <div class="text-sm leading-[1.3] font-extrabold wrap-anywhere">{{ wish.title }}</div>
      <div v-if="wish.note" class="text-muted-foreground text-xs wrap-anywhere">
        {{ wish.note }}
      </div>
      <Badge v-if="wish.price" class="self-start">{{ wish.price }}</Badge>
      <a v-if="link" :href="link" class="text-destructive text-xs font-bold" @click="openLink">
        Открыть ссылку ›
      </a>
      <div class="mt-auto flex flex-wrap gap-1.5 pt-1">
        <template v-if="!wish.done">
          <Button
            v-if="!mine"
            size="sm"
            :variant="wish.reserved_by_me ? 'outline' : 'secondary'"
            @click="wishes.toggleReserve(wish.id)"
          >
            {{ wish.reserved_by_me ? "Не дарю" : "Я подарю" }}
          </Button>
          <Button size="sm" @click="wishes.markDone(wish.id)">Сбылось</Button>
        </template>
        <Button
          v-if="wish.thumb_url"
          as="label"
          size="sm"
          variant="outline"
          class="relative cursor-pointer"
          aria-label="Заменить фото"
        >
          Фото
          <input type="file" accept="image/*" class="sr-only" @change="onFile" />
        </Button>
        <Button v-if="armed" size="sm" variant="warn" @click="emit('remove')">
          Точно удалить?
        </Button>
        <Button
          v-else
          size="sm"
          variant="outline"
          aria-label="Удалить желание"
          @click="emit('arm')"
        >
          ×
        </Button>
      </div>
    </div>
  </article>
</template>
