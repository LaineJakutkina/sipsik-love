<script setup lang="ts">
import { TALK_ICON, TALK_TITLE } from "@/domain/catPhrases";
import type { TalkKind } from "@/domain/coats";

/** Pop-up with what a talking cat says; lets taps go through to the cat */
defineProps<{ kind: TalkKind; text: string }>();
</script>

<template>
  <div
    role="status"
    class="bg-paper text-navy border-primary animate-in fade-in zoom-in-95 pointer-events-none absolute inset-x-3 top-3 z-10 rounded-2xl border-2 px-3.5 py-2.5 text-center shadow-lg"
  >
    <p class="text-muted-foreground text-[11px] font-extrabold tracking-wide uppercase">
      {{ TALK_ICON[kind] }} {{ TALK_TITLE[kind] }}
    </p>
    <p class="mt-0.5 text-[14px] leading-snug font-bold text-balance">{{ text }}</p>
  </div>
</template>
