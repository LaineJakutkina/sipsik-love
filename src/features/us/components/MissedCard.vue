<script setup lang="ts">
import { DAY_FORMS, plural } from "@/shared/lib/plural";
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
    <CardTitle>
      {{ session.petName }} скучал {{ session.missed }} {{ plural(session.missed, DAY_FORMS) }} 🥺
    </CardTitle>
    <p class="mt-1 text-[13px]">Потапай его, и он снова улыбнётся.</p>
  </Card>
  <Card v-else-if="session.welcomeBack" tone="soft">
    <CardTitle>С возвращением 💜</CardTitle>
    <p class="mt-1 text-[13px]">
      {{ session.petName }} рад тебя видеть. Приходи, когда захочется: он всегда здесь.
    </p>
  </Card>
</template>
