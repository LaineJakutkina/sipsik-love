<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import CatStage from "@/game/vue/CatStage.vue";
import { SegmentedPills, type PillOption } from "@/shared/components";
import { formatNumber, plural, TAP_FORMS } from "@/shared/lib/plural";
import { useSessionStore } from "@/stores/session";
import { useTapsStore } from "@/stores/taps";
import { useCatSpeech } from "./useCatSpeech";
import { useUsUiStore, type UsSegment } from "./usUi";

const SEGMENTS: readonly PillOption<UsSegment>[] = [
  { value: "today", label: "Сегодня" },
  { value: "thanks", label: "Спасибо" },
  { value: "mem", label: "Воспоминания" },
];

const session = useSessionStore();
const taps = useTapsStore();
const ui = useUsUiStore();
const { say, streak } = useCatSpeech();
const stage = useTemplateRef("stage");

const couple = computed(() => session.app.couple);
const look = computed(() => ({
  mood: session.catMood,
  coat: couple.value.coat,
  worn: couple.value.worn,
  clicks: couple.value.clicks,
}));
const segment = computed({
  get: () => ui.segment,
  set: (v: UsSegment | "") => v && ui.show(v),
});

function pet() {
  const result = taps.pet();
  if (result === "tired") stage.value?.shakeBubble();
  else if (result === "boop") stage.value?.boop();
}
</script>

<template>
  <CatStage ref="stage" :look="look" :say="say" label="Погладить котика" @pet="pet" />
  <div
    class="bg-primary border-primary-foreground relative -mt-[34px] flex items-baseline gap-2.5 self-center rounded-full border-3 px-5 py-2 font-bold"
  >
    {{ session.petName }}
    <b class="tabular text-secondary">{{ formatNumber(couple.clicks) }}</b>
    <span class="text-[13px]">{{ plural(couple.clicks, TAP_FORMS) }}</span>
  </div>
  <p v-if="streak" class="self-center text-center text-[13px] font-bold opacity-95">
    🔥 <b v-if="streak.n" class="text-secondary">{{ streak.n }}</b> {{ streak.text }}
  </p>
  <SegmentedPills v-model="segment" :options="SEGMENTS" inverse center label="Раздел" />
</template>
