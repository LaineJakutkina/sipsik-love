<script setup lang="ts">
import { computed } from "vue";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import CareTile from "./CareTile.vue";
import SupportCard from "./SupportCard.vue";
import TalkCard from "./TalkCard.vue";

/**
 * Care block: what is already sent to the partner shows as full cards; the
 * actions still available («Тяжело?», «Что-то задело?») sit side by side as tiles.
 */
const session = useSessionStore();
const sheets = useSheetsStore();

const canAsk = computed(
  () => !!session.app.partner && !!session.app.sos && !session.app.sos.mine,
);
const canTalk = computed(
  () => !!session.app.partner && !!session.app.talk && !session.app.talk.mine,
);
</script>

<template>
  <SupportCard />
  <TalkCard />
  <div
    v-if="canAsk || canTalk"
    class="grid gap-2 data-pair:grid-cols-2"
    :data-pair="(canAsk && canTalk) || undefined"
  >
    <CareTile
      v-if="canAsk"
      title="Тяжело?"
      emoji="🫂"
      :text="`${session.partnerName} получит подсказку, как тебя поддержать`"
      @select="sheets.open('sos')"
    />
    <CareTile
      v-if="canTalk"
      title="Что-то задело?"
      emoji="🕊"
      text="Помогу сказать это бережно, без обвинений"
      @select="sheets.open('talk')"
    />
  </div>
</template>
