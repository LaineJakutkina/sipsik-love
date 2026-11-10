<script setup lang="ts">
import { CameraIcon, ExternalLinkIcon, XIcon } from "@lucide/vue";
import { computed } from "vue";
import { safeUrl } from "@/domain/catalog";
import type { Wish } from "@/domain/types";
import { telegram } from "@/services/telegram";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { useWishes } from "./useWishes";
import WishPhoto from "./WishPhoto.vue";

/** One wish in the grid; `armed` swaps × for the delete confirmation */
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
  <Card
    as="article"
    :class="
      cn(
        'h-full gap-0 overflow-hidden p-0',
        wish.done && 'opacity-55',
        reserved && 'border-secondary ring-secondary ring-2',
      )
    "
  >
    <WishPhoto :wish :mine>
      <template #actions>
        <Button
          v-if="wish.thumb_url"
          as="label"
          variant="outline"
          size="icon-sm"
          aria-label="Заменить фото"
        >
          <CameraIcon class="size-4" :stroke-width="2.2" />
          <input type="file" accept="image/*" class="sr-only" @change="onFile" />
        </Button>
        <Button v-if="armed" variant="warn" size="sm" @click="emit('remove')">Удалить?</Button>
        <Button
          v-else
          variant="outline"
          size="icon-sm"
          aria-label="Удалить желание"
          @click="emit('arm')"
        >
          <XIcon class="size-4" :stroke-width="2.4" />
        </Button>
      </template>
    </WishPhoto>

    <div class="flex flex-1 flex-col gap-1 p-3">
      <h3 class="line-clamp-2 text-sm leading-snug font-extrabold wrap-anywhere">
        {{ wish.title }}
      </h3>
      <p v-if="wish.price" class="tabular text-[15px] font-extrabold">{{ wish.price }}</p>
      <p v-if="wish.note" class="text-muted-foreground line-clamp-2 text-xs wrap-anywhere">
        {{ wish.note }}
      </p>
      <a
        v-if="link"
        :href="link"
        class="text-destructive inline-flex items-center gap-1 self-start text-xs font-bold"
        @click="openLink"
      >
        Ссылка
        <ExternalLinkIcon class="size-3.5" :stroke-width="2.4" aria-hidden="true" />
      </a>

      <div v-if="!wish.done" class="mt-auto flex flex-col gap-1.5 pt-2">
        <Button
          v-if="!mine"
          size="sm"
          block
          :variant="wish.reserved_by_me ? 'outline' : 'secondary'"
          @click="wishes.toggleReserve(wish.id)"
        >
          {{ wish.reserved_by_me ? "Не дарю" : "Я подарю" }}
        </Button>
        <Button
          size="sm"
          block
          :variant="mine ? 'default' : 'outline'"
          @click="wishes.markDone(wish.id)"
        >
          Сбылось
        </Button>
      </div>
    </div>
  </Card>
</template>
