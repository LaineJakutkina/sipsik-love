<script setup lang="ts">
import { SlidersHorizontalIcon } from "@lucide/vue";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import BottomNav from "./BottomNav.vue";

/**
 * Page frame: navy band (brand row + per-screen band content) with a drip edge,
 * then the page body. `inApp` adds the settings button and the bottom nav.
 */
defineProps<{ inApp?: boolean }>();
const session = useSessionStore();
const sheets = useSheetsStore();
</script>

<template>
  <header
    class="text-primary-foreground bg-[linear-gradient(var(--navy),var(--navy))] bg-size-[100%_calc(100%-45px)] bg-top bg-no-repeat"
  >
    <div class="px-safe mx-auto flex max-w-[520px] flex-col gap-3.5 pt-2.5 pb-1">
      <div class="flex items-center justify-between gap-2.5">
        <div class="flex items-center gap-2 text-[19px] font-extrabold">
          <CharacterThumb
            kind="face"
            :mood="session.myMood ?? 'happy'"
            :width="34"
            class="bg-paper size-[34px] rounded-full p-0.5"
          />
          Сипсик <em class="text-secondary not-italic">Love</em>
        </div>
        <Button
          v-if="inApp"
          variant="inverse"
          size="icon"
          aria-label="Настройки пары"
          @click="sheets.open('settings')"
        >
          <SlidersHorizontalIcon class="size-[19px]" :stroke-width="2.2" />
        </Button>
      </div>
      <div class="flex flex-col gap-3.5">
        <slot name="band" />
      </div>
    </div>
    <svg
      class="fill-primary -mt-px mb-2.5 block h-[46px] w-full"
      viewBox="0 0 400 46"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 0H400V14Q384 14 378 22Q372 40 362 40Q352 40 350 26Q347 14 326 14H262Q246 14 240 22Q235 30 228 30Q220 30 216 22Q211 14 196 14H104Q86 14 80 26Q74 44 62 44Q50 44 48 30Q45 14 24 14H0Z"
      />
    </svg>
  </header>
  <main
    :class="
      cn(
        'px-safe relative z-[1] mx-auto flex max-w-[520px] flex-col gap-3.5 pt-0.5',
        inApp ? 'pb-nav' : 'pb-safe',
      )
    "
  >
    <slot />
  </main>
  <BottomNav v-if="inApp" />
</template>
