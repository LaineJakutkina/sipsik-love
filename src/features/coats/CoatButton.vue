<script setup lang="ts">
import type { CoatOffer } from "@/domain/coats";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";

defineProps<{ coat: CoatOffer; on: boolean; owned: boolean }>();
defineEmits<{ choose: [] }>();
</script>

<template>
  <button
    type="button"
    :aria-pressed="on"
    class="group border-primary bg-background aria-pressed:border-secondary aria-pressed:bg-secondary flex min-w-0 flex-col items-center gap-[3px] rounded-[18px] border-2 px-1 pt-2 pb-[9px]"
    @click="$emit('choose')"
  >
    <CharacterThumb kind="face" mood="happy" :coat="coat.id" :width="58" class="size-[58px]" />
    <b class="text-xs leading-[1.2]">{{ coat.name }}</b>
    <span class="text-muted-foreground group-aria-pressed:text-foreground text-[11px] font-bold">
      {{ on ? "Выбран" : owned ? "Ваш" : `${coat.price} ⭐` }}
    </span>
  </button>
</template>
