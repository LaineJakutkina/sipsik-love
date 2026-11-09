<script setup lang="ts">
import { GENDER_OPTIONS, type Gender } from "@/domain/moods";
import { SegmentedPills } from "@/shared/components";
import { Card } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

/** Asks how to address the user until the gender is set */
const session = useSessionStore();

function setGender(gender: Gender | "") {
  if (!gender) return;
  session.mutate(
    "couple.update",
    { gender },
    (s) => {
      s.me.gender = gender;
    },
    "Готово 💜",
  );
}
</script>

<template>
  <Card
    v-if="!session.app.me.gender"
    class="flex-row flex-wrap items-center justify-between gap-2.5"
  >
    <p class="min-w-[180px] flex-1">
      <b>Как к тебе обращаться?</b><br />
      <span class="text-muted-foreground text-[13px]">
        {{
          session.solo
            ? `Чтобы ${session.petName} обращался к тебе правильно`
            : `Чтобы ${session.partnerName} получал(а) «добавила» или «добавил»`
        }}
      </span>
    </p>
    <SegmentedPills
      :model-value="''"
      :options="GENDER_OPTIONS"
      label="Как к тебе обращаться"
      @update:model-value="setGender"
    />
  </Card>
</template>
