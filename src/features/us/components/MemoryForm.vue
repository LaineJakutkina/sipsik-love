<script setup lang="ts">
import { today } from "@/domain/dates";
import { t } from "@/domain/i18n";
import { tmpId } from "@/domain/ids";
import type { DateStr } from "@/domain/types";
import { notify } from "@/services/notify";
import { Field, PhotoPicker } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useSessionStore } from "@/stores/session";
import { useUsUiStore } from "../usUi";

/** “Новое воспоминание”: photo, a few words and the day it happened */
const session = useSessionStore();
const ui = useUsUiStore();
const max = today();

async function save() {
  const body = ui.memText.trim();
  const day: DateStr = ui.memDay || today();
  const draft = ui.memDraft;
  if (!body && !draft) return notify(t("us.memoryForm.empty"));
  ui.closeMemForm();
  if (draft) {
    notify(t("us.memoryForm.savingPhoto"));
    const ok = await session.act(
      "memory.add",
      { body, day, photo: draft.full, thumb: draft.thumb },
      t("us.memoryForm.saved"),
    );
    if (!ok) {
      ui.memForm = true;
      ui.memDraft = draft;
    }
  } else {
    session.mutate(
      "memory.add",
      { body, day },
      (s) => {
        (s.memories ??= []).unshift({
          id: tmpId(),
          who: "me",
          day,
          body,
          photo_url: null,
          thumb_url: null,
        });
      },
      t("us.memoryForm.saved"),
    );
  }
}
</script>

<template>
  <Card as="form" class="gap-2" @submit.prevent="save">
    <CardTitle>{{ t("us.memoryForm.title") }}</CardTitle>
    <PhotoPicker
      :title="ui.memDraft ? t('us.memoryForm.photoAdded') : t('us.memoryForm.addPhoto')"
      :subtitle="ui.memDraft ? t('us.memoryForm.tapToReplace') : t('us.memoryForm.photoOptional')"
      :preview="ui.memDraft?.thumb"
      @pick="ui.memDraft = $event"
    />
    <Textarea
      v-model="ui.memText"
      rows="3"
      maxlength="1000"
      :placeholder="t('us.memoryForm.placeholder')"
    />
    <Field :label="t('us.memoryForm.when')">
      <Input v-model="ui.memDay" type="date" :max="max" />
    </Field>
    <div class="grid grid-cols-2 gap-2">
      <Button type="button" variant="outline" @click="ui.closeMemForm()">
        {{ t("common.actions.cancel") }}
      </Button>
      <Button type="submit">{{ t("common.actions.save") }}</Button>
    </div>
  </Card>
</template>
