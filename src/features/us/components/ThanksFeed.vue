<script setup lang="ts">
import { dayHeading } from "@/domain/dates";
import { isTmp } from "@/domain/ids";
import type { Thanks } from "@/domain/types";
import { ChatBubble, DayHeading, RemoveButton } from "@/shared/components";
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

const author = (x: Thanks) =>
  x.who === "me" ? `Ты → ${session.partnerName}` : `${session.partnerName} → тебе`;
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-for="d in days" :key="d.day">
      <DayHeading>{{ dayHeading(d.day) }}</DayHeading>
      <div
        v-for="x in d.items"
        :key="x.id"
        :class="cn('flex items-center gap-2', x.who === 'me' && 'flex-row-reverse')"
      >
        <ChatBubble
          :from="x.who === 'me' ? 'thanks-me' : 'thanks'"
          :author="journal ? undefined : author(x)"
        >
          {{ x.body }}
        </ChatBubble>
        <button
          v-if="!journal && x.who !== 'me'"
          type="button"
          class="flex-none p-1 text-xl leading-none"
          :aria-pressed="x.hearted"
          aria-label="Нравится"
          @click="heart(x.id)"
        >
          {{ x.hearted ? "💛" : "🤍" }}
        </button>
        <span
          v-else-if="!journal && x.hearted"
          class="flex-none p-1 text-xl leading-none"
          title="Понравилось"
        >
          💛
        </span>
        <Button v-else-if="ui.thanksDel === x.id" variant="warn" size="sm" @click="remove(x.id)">
          Удалить?
        </Button>
        <RemoveButton v-else-if="!isTmp(x.id)" @remove="ui.thanksDel = x.id" />
      </div>
    </template>
  </div>
</template>
