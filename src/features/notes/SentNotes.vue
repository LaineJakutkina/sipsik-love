<script setup lang="ts">
import { formatDateTime, formatShort, ymd } from "@/domain/dates";
import { t } from "@/domain/i18n";
import { isTmp } from "@/domain/ids";
import type { Note } from "@/domain/types";
import { AnimatedList, ListRow, RemoveButton } from "@/shared/components";
import { Badge } from "@/shared/ui/badge";
import { useSessionStore } from "@/stores/session";

/** Notes I sent: delivered or still on their way (those can be cancelled) */
const session = useSessionStore();
const WEEK_MS = 7 * 864e5;

const arrivesBy = (n: Note) =>
  formatShort(ymd(new Date(new Date(n.created_at).getTime() + WEEK_MS)));

function cancel(id: string) {
  session.mutate(
    "note.delete",
    { id },
    (s) => {
      s.notes.sent = s.notes.sent.filter((n) => n.id !== id);
    },
    t("notes.sent.cancelled"),
  );
}
</script>

<template>
  <AnimatedList v-if="session.app.notes.sent.length" class="mt-3 flex flex-col">
    <ListRow v-for="n in session.app.notes.sent" :key="n.id">
      <div>{{ n.body }}</div>
      <div class="mt-[5px]">
        <Badge v-if="n.delivered_at" variant="secondary" size="sm">
          {{ t("notes.sent.delivered", { when: formatDateTime(n.delivered_at) }) }}
        </Badge>
        <Badge v-else variant="outline" size="sm">{{
          t("notes.sent.onTheWay", { date: arrivesBy(n) })
        }}</Badge>
      </div>
      <template #trail>
        <RemoveButton
          v-if="!n.delivered_at && !isTmp(n.id)"
          :label="t('notes.sent.cancel')"
          @remove="cancel(n.id)"
        />
      </template>
    </ListRow>
  </AnimatedList>
</template>
