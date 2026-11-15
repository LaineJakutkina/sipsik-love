<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { t } from "@/domain/i18n";
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
    notify(t("notes.sheet.empty"));
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
    t("notes.sheet.sent"),
  );
  text.value = "";
}
</script>

<template>
  <SheetTitle>{{
    session.solo ? t("notes.sheet.titleSolo") : t("notes.sheet.titlePair")
  }}</SheetTitle>
  <SheetDescription>
    {{
      session.solo
        ? t("notes.sheet.descriptionSolo")
        : t("notes.sheet.descriptionPair", { name: session.partnerName })
    }}
  </SheetDescription>
  <Textarea
    ref="field"
    v-model="text"
    rows="4"
    maxlength="2000"
    :aria-label="t('notes.sheet.textAria')"
    :placeholder="
      session.solo
        ? session.gendered('notes.sheet.placeholderSolo')
        : t('notes.sheet.placeholderPair')
    "
  />
  <div class="grid grid-cols-2 gap-2">
    <Button variant="outline" @click="sheets.close()">{{ t("common.actions.close") }}</Button>
    <Button @click="send">{{ t("notes.sheet.send") }}</Button>
  </div>
  <SentNotes />
</template>
