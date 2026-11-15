<script setup lang="ts">
import { t, tn } from "@/domain/i18n";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

/**
 * After a couple of days away: the cat missed you (shared space), or a guilt-free
 * «welcome back» (solo). Disappears once the cat is petted.
 */
const session = useSessionStore();
</script>

<template>
  <Card v-if="session.sad" tone="soft">
    <CardTitle>{{ tn("us.missed.title", session.missed, { name: session.petName }) }}</CardTitle>
    <p class="mt-1 text-[13px]">{{ t("us.missed.text") }}</p>
  </Card>
  <Card v-else-if="session.welcomeBack" tone="soft">
    <CardTitle>{{ t("us.missed.welcomeTitle") }}</CardTitle>
    <p class="mt-1 text-[13px]">
      {{ t("us.missed.welcomeText", { name: session.petName }) }}
    </p>
  </Card>
</template>
