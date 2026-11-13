<script setup lang="ts">
import { MOODS, moodLabel, type MoodId } from "@/domain/moods";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { telegram } from "@/services/telegram";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

/** «Какой ты сегодня?»: own mood picker plus the partner's mood */
const session = useSessionStore();

function pick(mood: MoodId) {
  telegram.haptic("medium");
  session.mutate("mood", { mood }, (s) => {
    s.moods.me = mood;
  });
}
</script>

<template>
  <Card>
    <CardTitle>Какой ты сегодня?</CardTitle>
    <div class="mt-3 grid grid-cols-5 gap-1">
      <button
        v-for="m in MOODS"
        :key="m.id"
        type="button"
        class="group flex min-w-0 flex-col items-center gap-[5px] text-[11px] font-bold"
        :aria-pressed="session.myMood === m.id"
        @click="pick(m.id)"
      >
        <span
          class="bg-muted group-aria-pressed:bg-secondary block size-14 rounded-full p-1"
        >
          <CharacterThumb
            kind="face"
            :mood="m.id"
            :coat="session.app.couple.coat"
            :width="48"
            class="size-full"
          />
        </span>
        <span class="text-muted-foreground group-aria-pressed:text-foreground w-full truncate">
          {{ m.name }}
        </span>
      </button>
    </div>
    <div v-if="session.app.partner" class="mt-3.5 flex flex-wrap items-center gap-2 text-[13px]">
      <CharacterThumb
        kind="face"
        :mood="session.app.moods.partner ?? 'neutral'"
        :coat="session.app.couple.coat"
        :width="30"
        class="size-[30px] flex-none"
      />
      <span>
        {{ session.partnerName }} сегодня:
        <b>{{
          session.app.moods.partner
            ? moodLabel(session.app.moods.partner, session.app.partner.gender)
            : "ещё не отметил(а)"
        }}</b>
      </span>
    </div>
  </Card>
</template>
