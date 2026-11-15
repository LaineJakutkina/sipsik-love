<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
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
    <CardTitle>{{ t("us.selfCare.title") }}</CardTitle>
    <p class="text-muted-foreground mt-1 text-[13px]">
      {{ t("us.selfCare.text") }}
    </p>
    <Button class="mt-2.5" @click="sheets.open('breath')">
      {{ t("us.selfCare.breathe") }}
    </Button>
    <p class="text-muted-foreground mt-2.5 text-[13px]">
      {{ t("us.selfCare.helpText") }}
    </p>
    <Button
      as="a"
      variant="link"
      class="self-start px-0 no-underline"
      :href="HELPLINES_URL"
      @click="openHelplines"
    >
      {{ t("us.selfCare.findHelpline") }}
    </Button>
  </Card>
</template>
