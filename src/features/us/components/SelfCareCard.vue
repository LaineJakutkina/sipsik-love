<script setup lang="ts">
import { computed } from "vue";
import { telegram } from "@/services/telegram";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";

const HELPLINES_URL = "https://findahelpline.com";
const HEAVY_MOODS = new Set(["tears", "tired", "angry"]);

/** Solo: gentle support when today's mood is heavy (there is no partner to send a signal to) */
const session = useSessionStore();
const sheets = useSheetsStore();
const show = computed(() => session.solo && !!session.myMood && HEAVY_MOODS.has(session.myMood));

function openHelplines(e: MouseEvent) {
  e.preventDefault();
  telegram.openLink(HELPLINES_URL);
}
</script>

<template>
  <Card v-if="show" tone="dashed">
    <CardTitle>🫂 Тяжёлый день</CardTitle>
    <p class="text-muted-foreground mt-1 text-[13px]">
      Так бывает, и это нормально. Можно просто немного подышать вместе с котиком: пара минут, и
      станет чуть легче.
    </p>
    <Button class="mt-2.5" @click="sheets.open('breath')">Подышать с котиком</Button>
    <p class="text-muted-foreground mt-2.5 text-[13px]">
      Если тебе очень плохо, не держи это в себе: напиши близкому человеку или обратись на линию
      психологической помощи, там выслушают бесплатно и анонимно.
    </p>
    <Button
      as="a"
      variant="link"
      class="self-start px-0 no-underline"
      :href="HELPLINES_URL"
      @click="openHelplines"
    >
      Найти линию помощи ›
    </Button>
  </Card>
</template>
