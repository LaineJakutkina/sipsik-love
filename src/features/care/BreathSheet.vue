<script setup lang="ts">
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { Button } from "@/shared/ui/button";
import { SheetTitle } from "@/shared/ui/sheet";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useBreathing } from "./useBreathing";

const session = useSessionStore();
const sheets = useSheetsStore();
const { phase, label, left } = useBreathing();
</script>

<template>
  <SheetTitle>Подыши вместе с котиком</SheetTitle>
  <div class="flex flex-col items-center gap-2.5 pt-[26px] pb-3.5">
    <div
      :data-phase="phase"
      class="bg-accent mb-[18px] grid size-[150px] place-items-center rounded-full transition-transform duration-[4s] ease-in-out data-[phase=hold]:scale-[1.35] data-[phase=in]:scale-[1.35] data-[phase=out]:scale-[.85] data-[phase=out]:duration-[6s]"
    >
      <CharacterThumb
        kind="face"
        mood="neutral"
        :coat="session.app.couple.coat"
        :width="90"
        class="size-[90px]"
      />
    </div>
    <b class="text-xl" aria-live="polite">{{ label }}</b>
    <span class="text-muted-foreground text-[13px] tabular">{{ left }} с</span>
  </div>
  <Button variant="outline" @click="sheets.close()">Закрыть</Button>
</template>
