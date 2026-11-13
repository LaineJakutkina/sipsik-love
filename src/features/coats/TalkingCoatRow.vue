<script setup lang="ts">
import { computed } from "vue";
import { TALK_ABOUT } from "@/domain/catPhrases";
import type { CoatOffer, TalkKind } from "@/domain/coats";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { Button } from "@/shared/ui/button";

/** One talking cat in the shop: face, what it says, and its buy/choose button */
const props = defineProps<{
  id: string;
  name: string;
  kind: TalkKind;
  /** Missing until the server starts selling this coat */
  offer?: CoatOffer;
  on: boolean;
  owned: boolean;
}>();
defineEmits<{ choose: [] }>();

const label = computed(() => {
  if (!props.offer) return "Скоро";
  if (props.on) return "Выбран";
  if (props.owned) return "Выбрать";
  return `${props.offer.price} ⭐`;
});
</script>

<template>
  <li class="bg-background flex items-center gap-3 rounded-2xl p-2.5">
    <CharacterThumb kind="face" mood="happy" :coat="id" :width="56" class="size-14 shrink-0" />
    <div class="min-w-0 grow">
      <b class="block text-[15px] leading-tight">{{ name }}</b>
      <span class="text-muted-foreground text-xs leading-snug">{{ TALK_ABOUT[kind] }}</span>
    </div>
    <Button
      size="sm"
      :variant="on ? 'ghost' : owned ? 'outline' : 'secondary'"
      class="shrink-0 px-3 py-1.5"
      :disabled="!offer || on"
      @click="$emit('choose')"
    >
      {{ label }}
    </Button>
  </li>
</template>
