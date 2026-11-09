<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";
import { BLAME, buildTalkMessage, FEELINGS, NEEDS } from "@/domain/care";
import { call, errorMessage } from "@/services/api/client";
import { notify } from "@/services/notify";
import { Field } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { SheetDescription, SheetTitle } from "@/shared/ui/sheet";
import { Textarea } from "@/shared/ui/textarea";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useCareActions } from "./careActions";
import ChipPicker from "./ChipPicker.vue";

const session = useSessionStore();
const sheets = useSheetsStore();
const { sendTalk } = useCareActions();

const fact = ref("");
const feelings = ref<string[]>([]);
const needs = ref<string[]>([]);
const ask = ref("");
const result = ref("");
const built = ref(false);
const aiBusy = ref(false);
const resultBox = useTemplateRef<HTMLElement>("resultBox");

const blames = computed(() => BLAME.test(fact.value));
const aiAvailable = computed(() => !!session.app.talk?.ai);

const build = () =>
  buildTalkMessage({
    fact: fact.value,
    feelings: feelings.value,
    needs: needs.value,
    ask: ask.value,
  });

async function assemble() {
  const txt = build();
  if (!txt) {
    notify("Заполни хотя бы один шаг");
    return;
  }
  built.value = true;
  result.value = txt;
  await nextTick();
  resultBox.value?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function soften() {
  const src = result.value.trim() || build();
  if (!src) {
    notify("Сначала заполни шаги");
    return;
  }
  aiBusy.value = true;
  try {
    const res = await call("nvc.rewrite", { text: src });
    result.value = res.text;
    notify("Готово ✨ Проверь и поправь, если нужно");
  } catch (e) {
    notify(errorMessage(e));
  } finally {
    aiBusy.value = false;
  }
}

function send() {
  const txt = result.value.trim() || build();
  if (!txt) {
    notify("Заполни хотя бы один шаг");
    return;
  }
  sendTalk(txt);
}
</script>

<template>
  <SheetTitle>Сказать бережно</SheetTitle>
  <SheetDescription>
    Четыре шага ненасильственного общения. Так {{ session.partnerName }} услышит тебя, а не начнёт
    защищаться.
  </SheetDescription>
  <Field label="1. Что произошло? Только факт, без оценок">
    <Textarea
      v-model="fact"
      rows="2"
      maxlength="400"
      placeholder="Например: вчера ты пришёл на час позже и не написал"
    />
    <span v-if="blames" class="text-destructive text-xs leading-[1.4] font-bold">
      Попробуй без «всегда» и «никогда»: опиши один конкретный случай
    </span>
  </Field>
  <Field as="div" label="2. Что я чувствую">
    <ChipPicker v-model="feelings" :options="FEELINGS" />
  </Field>
  <Field as="div" label="3. Что мне важно">
    <ChipPicker v-model="needs" :options="NEEDS" />
  </Field>
  <Field label="4. О чём я прошу? Конкретно и выполнимо">
    <Textarea
      v-model="ask"
      rows="2"
      maxlength="300"
      placeholder="Например: если задерживаешься, напиши мне пару слов"
    />
  </Field>
  <Button variant="outline" @click="assemble">Собрать сообщение</Button>
  <div v-if="built" ref="resultBox">
    <Field as="div" label="Готовое сообщение, можно поправить">
      <Textarea v-model="result" rows="5" maxlength="1500" aria-label="Готовое сообщение" />
      <Button v-if="aiAvailable" variant="outline" :disabled="aiBusy" @click="soften">
        {{ aiBusy ? "ИИ думает…" : "✨ Сделать мягче с ИИ" }}
      </Button>
    </Field>
  </div>
  <div class="grid grid-cols-2 gap-2">
    <Button variant="outline" @click="sheets.close()">Отмена</Button>
    <Button @click="send">Отправить</Button>
  </div>
</template>
