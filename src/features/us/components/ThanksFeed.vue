<script setup lang="ts">
import { computed } from "vue";
import { dayHeading } from "@/domain/dates";
import { isTmp } from "@/domain/ids";
import type { Thanks } from "@/domain/types";
import { AnimatedList, ChatBubble, DayHeading, RemoveButton } from "@/shared/components";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useUsUiStore } from "../usUi";
import { useThanks } from "../useThanks";

/**
 * Thanks grouped by day. In the couple feed the partner's thanks can be hearted;
 * own ones can be deleted until the partner hearts them. `journal` is the solo diary.
 */
defineProps<{ journal?: boolean }>();

const session = useSessionStore();
const ui = useUsUiStore();
const { days, heart, remove } = useThanks();

/** One flat keyed list (day headings + thanks), so rows can animate in and out */
const rows = computed(() =>
  days.value.flatMap((d) => [
    { key: `day:${d.day}`, day: d.day, item: null },
    ...d.items.map((x) => ({ key: x.id, day: d.day, item: x })),
  ]),
);

const author = (x: Thanks) =>
  x.who === "me" ? `Ты → ${session.partnerName}` : `${session.partnerName} → тебе`;
</script>

<template>
  <AnimatedList as="div" class="flex flex-col gap-2">
    <div
      v-for="r in rows"
      :key="r.key"
      :class="cn(r.item && 'flex items-center gap-2', r.item?.who === 'me' && 'flex-row-reverse')"
    >
      <DayHeading v-if="!r.item">{{ dayHeading(r.day) }}</DayHeading>
      <template v-else>
        <ChatBubble
          :from="r.item.who === 'me' ? 'thanks-me' : 'thanks'"
          :author="journal ? undefined : author(r.item)"
        >
          {{ r.item.body }}
        </ChatBubble>
        <button
          v-if="!journal && r.item.who !== 'me'"
          type="button"
          class="press flex-none p-1 text-xl leading-none"
          :aria-pressed="r.item.hearted"
          aria-label="Нравится"
          @click="heart(r.item.id)"
        >
          <span :key="String(r.item.hearted)" class="animate-pop inline-block">
            {{ r.item.hearted ? "💛" : "🤍" }}
          </span>
        </button>
        <span
          v-else-if="!journal && r.item.hearted"
          class="flex-none p-1 text-xl leading-none"
          title="Понравилось"
        >
          💛
        </span>
        <Button
          v-else-if="ui.thanksDel === r.item.id"
          variant="warn"
          size="sm"
          @click="remove(r.item.id)"
        >
          Удалить?
        </Button>
        <RemoveButton v-else-if="!isTmp(r.item.id)" @remove="ui.thanksDel = r.item.id" />
      </template>
    </div>
  </AnimatedList>
</template>
