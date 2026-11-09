<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useInvite } from "./invite";

/** Settings footer: share the cat (solo), invite the other person, or show who is in the space */
const session = useSessionStore();
const { shareInvite, copyInvite } = useInvite();
const couple = computed(() => session.app.couple);
</script>

<template>
  <Card v-if="session.solo && couple.invite_link" tone="dark" class="my-1 gap-2.5">
    <CardTitle>Поделиться котиком</CardTitle>
    <p class="mt-1 text-[13px] opacity-80">
      Если захочешь, можно позвать близкого человека. Тогда {{ session.petName }}, вишлист и списки
      станут общими, а всё, что ты уже
      {{ session.gendered("добавил", "добавила", "добавил(а)") }}, сохранится.
    </p>
    <div
      class="bg-navy-2 rounded-[14px] px-3 py-2.5 text-[13px] font-semibold wrap-anywhere select-all"
    >
      {{ couple.invite_link }}
    </div>
    <div class="grid grid-cols-2 gap-2">
      <Button variant="secondary" @click="shareInvite">Отправить</Button>
      <Button variant="inverse" @click="copyInvite">Скопировать</Button>
    </div>
  </Card>
  <template v-else-if="couple.invite_link">
    <p class="text-muted-foreground text-[13px]">
      Код приглашения: <b>{{ couple.invite_code }}</b>
    </p>
    <Button variant="secondary" @click="shareInvite">Пригласить {{ session.other.gen }}</Button>
  </template>
  <p v-else class="text-muted-foreground text-[13px]">
    {{ session.friends ? "Вы вместе" : "Вы в паре" }}: {{ session.meName }} и
    {{ session.partnerName }}
  </p>
</template>
