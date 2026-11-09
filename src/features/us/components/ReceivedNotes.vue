<script setup lang="ts">
import { computed } from "vue";
import { formatDateTime } from "@/domain/dates";
import { ListRow, ListSub } from "@/shared/components";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

/** The last three notes that arrived */
const session = useSessionStore();
const notes = computed(() => session.app.notes.received.slice(0, 3));
</script>

<template>
  <Card v-if="notes.length">
    <CardTitle>
      {{ session.solo ? "Записки из прошлого" : `Записки от ${session.partnerName}` }}
    </CardTitle>
    <ul class="mt-3 flex flex-col">
      <ListRow v-for="n in notes" :key="n.id">
        <div>{{ n.body }}</div>
        <ListSub v-if="n.delivered_at" class="mt-1">{{ formatDateTime(n.delivered_at) }}</ListSub>
      </ListRow>
    </ul>
  </Card>
</template>
