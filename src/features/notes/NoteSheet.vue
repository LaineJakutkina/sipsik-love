<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { tmpId } from "@/domain/ids";
import { notify } from "@/services/notify";
import { Button } from "@/shared/ui/button";
import { SheetDescription, SheetTitle } from "@/shared/ui/sheet";
import { Textarea } from "@/shared/ui/textarea";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import SentNotes from "./SentNotes.vue";

const session = useSessionStore();
const sheets = useSheetsStore();
const text = ref("");
const field = useTemplateRef<{ $el: HTMLTextAreaElement }>("field");

onMounted(() => setTimeout(() => field.value?.$el.focus(), 50));

function send() {
  const body = text.value.trim();
  if (!body) {
    notify("Напиши текст записки");
    return;
  }
  session.mutate(
    "note.send",
    { body },
    (s) => {
      s.notes.sent.unshift({
        id: tmpId(),
        body,
        delivered_at: null,
        created_at: new Date().toISOString(),
      });
    },
    "Записка улетела. Придёт неожиданно 💌",
  );
  text.value = "";
}
</script>

<template>
  <SheetTitle>{{ session.solo ? "Записка себе в будущее" : "Записка-сюрприз" }}</SheetTitle>
  <SheetDescription>
    {{ session.solo ? "Придёт тебе в Telegram" : `Получит ${session.partnerName}. Придёт` }} в
    случайный момент в течение недели. Точное время не узнает никто, даже ты.
  </SheetDescription>
  <Textarea
    ref="field"
    v-model="text"
    rows="4"
    maxlength="2000"
    aria-label="Текст записки"
    :placeholder="
      session.solo
        ? 'Например: не забудь, как ты справилась с этой неделей'
        : 'Напиши что-нибудь тёплое'
    "
  />
  <div class="grid grid-cols-2 gap-2">
    <Button variant="outline" @click="sheets.close()">Закрыть</Button>
    <Button @click="send">Отправить наугад</Button>
  </div>
  <SentNotes />
</template>
