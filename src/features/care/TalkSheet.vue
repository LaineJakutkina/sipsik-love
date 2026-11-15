<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";
import { BLAME, buildTalkMessage, FEELINGS, NEEDS } from "@/domain/care";
import { t } from "@/domain/i18n";
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
    notify(t("care.talkSheet.fillOneStep"));
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
    notify(t("care.talkSheet.fillStepsFirst"));
    return;
  }
  aiBusy.value = true;
  try {
    const res = await call("nvc.rewrite", { text: src });
    result.value = res.text;
    notify(t("care.talkSheet.aiDone"));
  } catch (e) {
    notify(errorMessage(e));
  } finally {
    aiBusy.value = false;
  }
}

function send() {
  const txt = result.value.trim() || build();
  if (!txt) {
    notify(t("care.talkSheet.fillOneStep"));
    return;
  }
  sendTalk(txt);
}
</script>

<template>
  <SheetTitle>{{ t("care.talkSheet.title") }}</SheetTitle>
  <SheetDescription>
    {{ t("care.talkSheet.description", { name: session.partnerName }) }}
  </SheetDescription>
  <Field :label="t('care.talkSheet.factLabel')">
    <Textarea
      v-model="fact"
      rows="2"
      maxlength="400"
      :placeholder="t('care.talkSheet.factPlaceholder')"
    />
    <span v-if="blames" class="text-destructive text-xs leading-[1.4] font-bold">
      {{ t("care.talkSheet.blameHint") }}
    </span>
  </Field>
  <Field as="div" :label="t('care.talkSheet.feelingsLabel')">
    <ChipPicker v-model="feelings" :options="FEELINGS" />
  </Field>
  <Field as="div" :label="t('care.talkSheet.needsLabel')">
    <ChipPicker v-model="needs" :options="NEEDS" />
  </Field>
  <Field :label="t('care.talkSheet.askLabel')">
    <Textarea
      v-model="ask"
      rows="2"
      maxlength="300"
      :placeholder="t('care.talkSheet.askPlaceholder')"
    />
  </Field>
  <Button variant="outline" @click="assemble">{{ t("care.talkSheet.assemble") }}</Button>
  <div v-if="built" ref="resultBox">
    <Field as="div" :label="t('care.talkSheet.resultLabel')">
      <Textarea
        v-model="result"
        rows="5"
        maxlength="1500"
        :aria-label="t('care.talkSheet.resultAria')"
      />
      <Button v-if="aiAvailable" variant="outline" :disabled="aiBusy" @click="soften">
        {{ aiBusy ? t("care.talkSheet.aiBusy") : t("care.talkSheet.aiSoften") }}
      </Button>
    </Field>
  </div>
  <div class="grid grid-cols-2 gap-2">
    <Button variant="outline" @click="sheets.close()">{{ t("common.actions.cancel") }}</Button>
    <Button @click="send">{{ t("common.actions.send") }}</Button>
  </div>
</template>
