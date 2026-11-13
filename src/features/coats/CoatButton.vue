<script setup lang="ts">
import type { CoatOffer } from "@/domain/coats";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";

/** Coat tile: the chosen one is peach, a coat still to buy shows its price in stars */
defineProps<{ coat: CoatOffer; on: boolean; owned: boolean }>();
defineEmits<{ choose: [] }>();
</script>

<template>
  <button
    type="button"
    :aria-pressed="on"
    class="group bg-muted aria-pressed:bg-secondary flex min-w-0 flex-col items-center gap-1 rounded-[18px] px-1 pt-2.5 pb-2.5"
    @click="$emit('choose')"
  >
    <CharacterThumb kind="face" mood="happy" :coat="coat.id" :width="58" class="size-[58px]" />
    <b class="text-xs leading-[1.2]">{{ coat.name }}</b>
    <span
      v-if="on || owned"
      class="text-muted-foreground group-aria-pressed:text-foreground text-[11px] font-bold"
    >
      {{ on ? "Выбран" : "Есть" }}
    </span>
    <span v-else class="bg-background tabular rounded-full px-2 py-0.5 text-[11px] font-extrabold">
      {{ coat.price }} ⭐
    </span>
  </button>
</template>
