<script setup lang="ts">
import { ExternalLinkIcon, XIcon } from "@lucide/vue";
import { computed } from "vue";
import { safeUrl } from "@/domain/catalog";
import type { Wish } from "@/domain/types";
import { telegram } from "@/services/telegram";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { useWishes } from "./useWishes";
import WishPhoto from "./WishPhoto.vue";

/** One wish in the grid; `armed` turns the footer into the delete confirmation */
const props = defineProps<{ wish: Wish; mine: boolean; armed: boolean }>();
const emit = defineEmits<{ arm: []; remove: [] }>();
const wishes = useWishes();

const reserved = computed(() => !props.mine && props.wish.reserved_by_me && !props.wish.done);
const link = computed(() => (props.wish.link ? safeUrl(props.wish.link) : null));

function openLink(e: MouseEvent) {
  e.preventDefault();
  if (link.value) telegram.openLink(link.value);
}
</script>

<template>
  <Card
    as="article"
    padding="sections"
    :class="
      cn('pt-0', wish.done && 'opacity-55', reserved && 'border-secondary ring-secondary ring-2')
    "
  >
    <WishPhoto :wish :mine />

    <CardHeader>
      <CardTitle as="h3" class="line-clamp-2 text-sm leading-snug wrap-anywhere">
        {{ wish.title }}
      </CardTitle>
      <CardDescription v-if="wish.note" class="line-clamp-2 wrap-anywhere">
        {{ wish.note }}
      </CardDescription>
      <CardAction>
        <Button
          variant="ghost"
          size="icon-sm"
          class="-my-1.5 -mr-1.5"
          aria-label="Удалить желание"
          @click="emit('arm')"
        >
          <XIcon class="size-4" :stroke-width="2.4" />
        </Button>
      </CardAction>
    </CardHeader>

    <CardContent v-if="wish.price || link" class="flex items-center justify-between gap-2">
      <span v-if="wish.price" class="tabular truncate text-[15px] font-extrabold">
        {{ wish.price }}
      </span>
      <a
        v-if="link"
        :href="link"
        class="text-destructive ml-auto inline-flex flex-none items-center gap-1 text-xs font-bold"
        @click="openLink"
      >
        Ссылка
        <ExternalLinkIcon class="size-3.5" :stroke-width="2.4" aria-hidden="true" />
      </a>
    </CardContent>

    <CardFooter v-if="armed" class="mt-auto">
      <Button variant="warn" size="sm" block @click="emit('remove')">Удалить?</Button>
    </CardFooter>
    <CardFooter v-else-if="!wish.done" class="mt-auto flex-col">
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
    </CardFooter>
  </Card>
</template>
