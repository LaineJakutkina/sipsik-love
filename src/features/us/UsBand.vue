<script setup lang="ts">
import { SlidersHorizontalIcon } from "@lucide/vue";
import { computed, useTemplateRef } from "vue";
import { itemProgress } from "@/domain/items";
import CatStage from "@/game/vue/CatStage.vue";
import { telegram } from "@/services/telegram";
import { SegmentedPills, type PillOption } from "@/shared/components";
import { formatNumber, plural, TAP_FORMS } from "@/shared/lib/plural";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useTapsStore } from "@/stores/taps";
import CatPhrase from "./components/CatPhrase.vue";
import { useCatSpeech } from "./useCatSpeech";
import { useTalkingCat } from "./useTalkingCat";
import { useUsUiStore, type UsSegment } from "./usUi";

const SEGMENTS: readonly PillOption<UsSegment>[] = [
  { value: "today", label: "Сегодня" },
  { value: "thanks", label: "Спасибо" },
  { value: "mem", label: "Воспоминания" },
];
/** Every N-th tap gets a burst of hearts */
const ROUND_TAPS = 100;

const session = useSessionStore();
const sheets = useSheetsStore();
const taps = useTapsStore();
const ui = useUsUiStore();
const { say, streak } = useCatSpeech();
const { kind: talkKind, phrase, onTap: talkOnTap } = useTalkingCat();
const stage = useTemplateRef("stage");

const couple = computed(() => session.app.couple);
const look = computed(() => ({
  mood: session.catMood,
  coat: couple.value.coat,
  worn: couple.value.worn,
  clicks: couple.value.clicks,
}));
const progress = computed(() => itemProgress(couple.value.clicks));
const segment = computed({
  get: () => ui.segment,
  set: (v: UsSegment | "") => v && ui.show(v),
});

function pet() {
  const result = taps.pet();
  if (result === "tired") {
    stage.value?.shakeBubble();
    return;
  }
  if (result === "boop") stage.value?.boop();
  const clicks = couple.value.clicks;
  if (clicks > 0 && clicks % ROUND_TAPS === 0) {
    stage.value?.celebrate(formatNumber(clicks));
    telegram.haptic("heavy");
  }
  talkOnTap();
}
</script>

<template>
  <div class="relative">
    <CatStage ref="stage" :look="look" :say="say" label="Погладить котика" @pet="pet" />
    <span
      v-if="streak?.n"
      class="bg-primary text-primary-foreground pointer-events-none absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-xs font-extrabold"
    >
      <span aria-hidden="true">🔥 {{ streak.n }}</span>
      <span class="sr-only">{{ streak.text }}</span>
    </span>
    <Button
      size="icon"
      class="absolute top-2.5 right-2.5 size-9"
      aria-label="Настройки"
      @click="sheets.open('settings')"
    >
      <SlidersHorizontalIcon class="size-[18px]" :stroke-width="2.2" />
    </Button>
    <Transition leave-active-class="animate-out fade-out">
      <CatPhrase v-if="talkKind && phrase" :kind="talkKind" :text="phrase" />
    </Transition>
  </div>
  <div
    class="bg-primary border-primary-foreground relative -mt-[34px] flex items-baseline gap-2.5 self-center rounded-full border-3 px-5 py-2 font-bold"
  >
    {{ session.petName }}
    <b :key="couple.clicks" class="tabular text-secondary animate-pop inline-block">
      {{ formatNumber(couple.clicks) }}
    </b>
    <span class="text-[13px]">{{ plural(couple.clicks, TAP_FORMS) }}</span>
  </div>
  <div v-if="progress.next" class="flex w-full max-w-[260px] flex-col gap-1.5 self-center">
    <Progress :model-value="progress.percent" class="bg-navy-2 h-1.5 border-0" />
    <p class="text-center text-xs font-semibold opacity-80">
      Ещё {{ formatNumber(progress.left) }} до вещи «{{ progress.next.name }}»
    </p>
  </div>
  <p v-if="streak?.note" class="self-center text-center text-[13px] font-bold opacity-95">
    {{ streak.note }}
  </p>
  <SegmentedPills v-model="segment" :options="SEGMENTS" track label="Раздел" />
</template>
