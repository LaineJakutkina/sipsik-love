<script setup lang="ts">
import { computed, ref } from "vue";
import { today } from "@/domain/dates";
import { GENDER_OPTIONS, type Gender } from "@/domain/moods";
import type { PayloadOf } from "@/services/api/contract";
import { telegram } from "@/services/telegram";
import { Field, SegmentedPills } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { SheetTitle } from "@/shared/ui/sheet";
import { Switch } from "@/shared/ui/switch";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import InviteSection from "./InviteSection.vue";

const session = useSessionStore();
const sheets = useSheetsStore();
const me = session.app.me;
const couple = computed(() => session.app.couple);

const myName = ref(session.meName);
const gender = ref<Gender | "">(me.gender ?? "");
const petName = ref(session.petName);
const startDate = ref(couple.value.start_date);
const notifyOn = ref(me.notify !== false);
const leaveArmed = ref(false);

const privacyUrl = new URL("privacy.html", location.href).href;

const leaveLabel = computed(() => {
  if (leaveArmed.value)
    return session.solo
      ? "Точно? Удалятся котик, вишлист и все списки. Нажми ещё раз"
      : "Точно выйти? Твои желания удалятся. Нажми ещё раз";
  return session.solo ? "Начать заново" : "Выйти из пары";
});

async function save() {
  const payload: PayloadOf<"couple.update"> = {
    my_name: myName.value.trim(),
    pet_name: petName.value.trim(),
  };
  if (!session.solo) {
    payload.start_date = startDate.value.trim();
    if (notifyOn.value !== (me.notify !== false)) payload.notify = notifyOn.value;
  }
  if (gender.value && gender.value !== me.gender) payload.gender = gender.value;
  if (await session.act("couple.update", payload, "Сохранено")) sheets.close();
}

function openPrivacy(e: MouseEvent) {
  e.preventDefault();
  telegram.openLink(privacyUrl);
}

async function leave() {
  if (!leaveArmed.value) {
    leaveArmed.value = true;
    return;
  }
  leaveArmed.value = false;
  const msg = session.solo
    ? "Всё удалено, можно начать заново"
    : session.gendered("Ты вышел из пары", "Ты вышла из пары", "Ты вышел(а) из пары");
  sheets.close();
  await session.act("couple.leave", {}, msg);
}
</script>

<template>
  <SheetTitle>{{ session.solo ? "Настройки" : "Настройки пары" }}</SheetTitle>
  <Field label="Твоё имя">
    <Input v-model="myName" type="text" maxlength="30" />
  </Field>
  <Field as="div" label="Как к тебе обращаться">
    <SegmentedPills
      v-model="gender"
      :options="GENDER_OPTIONS"
      label="Как к тебе обращаться"
      class="mt-0.5"
    />
  </Field>
  <Field label="Имя котика">
    <Input v-model="petName" type="text" maxlength="30" />
  </Field>
  <template v-if="!session.solo">
    <Field label="Начало отношений">
      <Input v-model="startDate" type="date" :max="today()" />
    </Field>
    <label class="text-foreground flex cursor-pointer items-center gap-3 text-sm font-semibold">
      <Switch v-model="notifyOn" />
      <span>Присылать в Telegram, что отмечает {{ session.partnerName }}</span>
    </label>
  </template>
  <div class="flex flex-col gap-2">
    <Button @click="save">Сохранить</Button>
    <Button variant="outline" @click="sheets.close()">Закрыть</Button>
  </div>
  <InviteSection />
  <Button
    as="a"
    variant="link"
    class="text-muted-foreground no-underline"
    href="privacy.html"
    @click="openPrivacy"
  >
    Конфиденциальность и удаление данных
  </Button>
  <Button variant="link" @click="leave">{{ leaveLabel }}</Button>
</template>
