<script setup lang="ts">
import { today } from "@/domain/dates";
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
  if (!body && !draft) return notify("Добавь фото или пару слов");
  ui.closeMemForm();
  if (draft) {
    notify("Сохраняем вместе с фото…");
    const ok = await session.act(
      "memory.add",
      { body, day, photo: draft.full, thumb: draft.thumb },
      "Воспоминание сохранено 📸",
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
      "Воспоминание сохранено 📸",
    );
  }
}
</script>

<template>
  <Card as="form" class="gap-2" @submit.prevent="save">
    <CardTitle>Новое воспоминание</CardTitle>
    <PhotoPicker
      :title="ui.memDraft ? 'Фото добавлено' : 'Добавить фото'"
      :subtitle="ui.memDraft ? 'Нажми, чтобы заменить' : 'Можно и без фото'"
      :preview="ui.memDraft?.thumb"
      @pick="ui.memDraft = $event"
    />
    <Textarea v-model="ui.memText" rows="3" maxlength="1000" placeholder="Что запомнилось?" />
    <Field label="Когда это было">
      <Input v-model="ui.memDay" type="date" :max="max" />
    </Field>
    <div class="grid grid-cols-2 gap-2">
      <Button type="button" variant="outline" @click="ui.closeMemForm()">Отмена</Button>
      <Button type="submit">Сохранить</Button>
    </div>
  </Card>
</template>
