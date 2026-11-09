<script setup lang="ts">
import { computed } from "vue";
import { useInvite } from "./invite";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

/** Navy “invite your partner” card; renders nothing once there is a partner or in solo mode */
const session = useSessionStore();
const link = computed(() => {
  const s = session.state;
  if (!s?.couple || s.partner || session.solo) return null;
  return s.couple.invite_link || null;
});

const { shareInvite, copyInvite } = useInvite();
</script>

<template>
  <Card v-if="link" tone="dark" class="gap-2.5">
    <CardTitle>Пригласи свою половинку</CardTitle>
    <p class="mt-1 text-[13px] opacity-80">
      Отправь ссылку. Как только партнёр откроет её, у вас будет общий котик и все списки.
    </p>
    <div
      class="bg-navy-2 rounded-[14px] px-3 py-2.5 text-[13px] font-semibold wrap-anywhere select-all"
    >
      {{ link }}
    </div>
    <div class="grid grid-cols-2 gap-2">
      <Button variant="secondary" @click="shareInvite">Отправить</Button>
      <Button variant="inverse" @click="copyInvite">Скопировать</Button>
    </div>
  </Card>
</template>
