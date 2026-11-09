<script setup lang="ts">
import { ref } from "vue";
import { SOS_KINDS } from "@/domain/care";
import { notify } from "@/services/notify";
import { Button } from "@/shared/ui/button";
import { SheetDescription, SheetTitle } from "@/shared/ui/sheet";
import { Textarea } from "@/shared/ui/textarea";
import { Toggle } from "@/shared/ui/toggle";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useCareActions } from "./careActions";

const session = useSessionStore();
const sheets = useSheetsStore();
const { sendSos } = useCareActions();

const kind = ref<string | null>(null);
const body = ref("");
const feminine = session.app.me.gender === "f";

function send() {
  if (!kind.value) {
    notify("Выбери, что тебе сейчас нужно");
    return;
  }
  void sendSos(kind.value, body.value.trim());
}
</script>

<template>
  <SheetTitle>Что тебе сейчас нужно?</SheetTitle>
  <SheetDescription>
    {{ session.partnerName }} сразу получит сообщение в Telegram с подсказкой, как тебя поддержать.
  </SheetDescription>
  <div class="flex flex-col gap-2">
    <Toggle
      v-for="k in SOS_KINDS"
      :key="k.id"
      variant="tile"
      size="none"
      class="gap-3 rounded-[16px] font-bold"
      :model-value="kind === k.id"
      @update:model-value="kind = k.id"
    >
      <span class="flex-none text-[22px]">{{ k.emoji }}</span>
      {{ feminine && k.textF ? k.textF : k.text }}
    </Toggle>
  </div>
  <Textarea
    v-model="body"
    rows="2"
    maxlength="300"
    placeholder="Пара слов, если хочется (необязательно)"
  />
  <div class="grid grid-cols-2 gap-2">
    <Button variant="outline" @click="sheets.close()">Отмена</Button>
    <Button @click="send">Отправить сигнал</Button>
  </div>
</template>
