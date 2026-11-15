<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
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

const canAsk = computed(() => !!session.app.partner && !!session.app.sos && !session.app.sos.mine);
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
      :title="t('us.care.sosTitle')"
      emoji="🫂"
      :text="t('us.care.sosText', { name: session.partnerName })"
      @select="sheets.open('sos')"
    />
    <CareTile
      v-if="canTalk"
      :title="t('us.care.talkTitle')"
      emoji="🕊"
      :text="t('us.care.talkText')"
      @select="sheets.open('talk')"
    />
  </div>
</template>
