<script setup lang="ts">
import { DAY_FORMS, plural } from "@/shared/lib/plural";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

/** The cat missed you for a couple of days; disappears once it's petted */
const session = useSessionStore();
</script>

<template>
  <Card v-if="session.sad" tone="soft">
    <CardTitle>
      {{ session.petName }} скучал {{ session.missed }} {{ plural(session.missed, DAY_FORMS) }} 🥺
    </CardTitle>
    <p class="mt-1 text-[13px]">Потапай его, и он снова улыбнётся.</p>
  </Card>
</template>
