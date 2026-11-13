<script setup lang="ts">
import AppShell from "@/app/AppShell.vue";
import CatStage from "@/game/vue/CatStage.vue";

/**
 * First load: the «Мы» screen in outline. Same frame, cat and blocks as the real
 * screen, so nothing jumps when the data arrives — the grey shapes just fill in.
 */
</script>

<template>
  <AppShell preview>
    <template #band>
      <CatStage :look="{ mood: 'neutral', worn: {} }" />
      <div
        class="bg-primary border-primary-foreground relative -mt-[34px] h-[46px] w-52 animate-pulse self-center rounded-full border-3"
      />
      <div class="bg-navy-2 h-1.5 w-full max-w-[260px] animate-pulse self-center rounded-full" />
      <div class="bg-navy-2 h-[42px] animate-pulse rounded-full" />
    </template>
    <div class="flex animate-pulse flex-col gap-3.5" role="status">
      <span class="sr-only">Загружаем вашего котика…</span>
      <div class="grid grid-cols-6 gap-2">
        <div class="bg-accent col-span-4 h-[84px] rounded-[22px]" />
        <div class="bg-muted col-span-2 h-[84px] rounded-[22px]" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div v-for="i in 3" :key="i" class="bg-muted h-[76px] rounded-[18px]" />
      </div>
      <div class="bg-muted h-44 rounded-lg" />
    </div>
  </AppShell>
</template>
