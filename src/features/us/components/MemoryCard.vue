<script setup lang="ts">
import { computed } from "vue";
import { formatDate } from "@/domain/dates";
import { t } from "@/domain/i18n";
import { isTmp } from "@/domain/ids";
import type { Memory } from "@/domain/types";
import { LazyImage, RemoveButton } from "@/shared/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useUsUiStore } from "../usUi";

/** One memory: optional photo (opens full size), date · author, delete with confirmation */
const props = defineProps<{ memory: Memory; ago?: string; soft?: boolean }>();

const session = useSessionStore();
const sheets = useSheetsStore();
const ui = useUsUiStore();

const meta = computed(() => {
  const m = props.memory;
  const who = m.who === "me" ? t("us.memory.byMe") : m.who === "partner" ? session.partnerName : "";
  const when = props.ago || formatDate(m.day);
  return who ? t("us.memory.meta", { when, who }) : when;
});

function openPhoto() {
  if (props.memory.photo_url) sheets.open("photo", { url: props.memory.photo_url });
}

function remove(id: string) {
  if (isTmp(id)) return;
  ui.memDel = null;
  session.mutate(
    "memory.delete",
    { id },
    (s) => {
      s.memories = (s.memories ?? []).filter((m) => m.id !== id);
    },
    t("us.memory.deleted"),
  );
}
</script>

<template>
  <article
    :class="
      cn(
        'bg-card overflow-hidden rounded-[22px] border-2',
        soft ? 'border-secondary' : 'border-primary',
      )
    "
  >
    <button
      v-if="memory.thumb_url"
      type="button"
      :aria-label="t('us.memory.openPhoto')"
      :class="
        cn(
          'bg-muted block aspect-4/3 w-full cursor-zoom-in border-b-2 p-0',
          soft ? 'border-secondary' : 'border-primary',
        )
      "
      @click="openPhoto"
    >
      <LazyImage :src="memory.thumb_url" class="size-full" />
    </button>
    <div class="flex flex-col gap-1 px-3.5 py-3">
      <div class="text-muted-foreground flex items-center justify-between gap-2 text-xs font-bold">
        <span>{{ meta }}</span>
        <template v-if="!isTmp(memory.id)">
          <Button
            v-if="ui.memDel === memory.id"
            variant="warn"
            size="sm"
            @click="remove(memory.id)"
          >
            {{ t("us.memory.confirmDelete") }}
          </Button>
          <RemoveButton v-else @remove="ui.memDel = memory.id" />
        </template>
      </div>
      <p v-if="memory.body" class="text-[15px] leading-[1.4] wrap-anywhere">{{ memory.body }}</p>
    </div>
  </article>
</template>
