<script setup lang="ts">
import AppShell from "@/app/AppShell.vue";
import { t } from "@/domain/i18n";
import CatStage from "@/game/vue/CatStage.vue";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * First load: the «Мы» screen in outline. Same frame, cat and blocks as the real
 * screen, so nothing jumps when the data arrives — the grey shapes just fill in.
 */
</script>

<template>
  <AppShell preview>
    <template #band>
      <CatStage :look="{ mood: 'neutral', worn: {} }" />
      <Skeleton
        class="bg-primary border-primary-foreground relative -mt-[34px] h-[46px] w-52 self-center rounded-full border-3"
      />
      <div class="flex w-full max-w-[260px] flex-col gap-1.5 self-center">
        <Skeleton tone="band" class="h-1.5 rounded-full" />
        <Skeleton tone="band" class="h-4 w-3/4 self-center" />
      </div>
      <Skeleton tone="band" class="h-[39px] rounded-full" />
    </template>
    <div class="flex flex-col gap-3.5" role="status">
      <span class="sr-only">{{ t("status.loading") }}</span>
      <div class="grid grid-cols-6 gap-2">
        <Skeleton class="bg-accent col-span-4 h-[84px] rounded-[22px]" />
        <Skeleton class="col-span-2 h-[84px] rounded-[22px]" />
      </div>
      <div class="grid grid-cols-3 gap-2">
        <Skeleton v-for="i in 3" :key="i" class="h-[76px] rounded-[18px]" />
      </div>
      <Skeleton class="h-44 rounded-lg" />
    </div>
  </AppShell>
</template>
