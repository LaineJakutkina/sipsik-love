<script setup lang="ts">
import { computed, ref } from "vue";
import { today } from "@/domain/dates";
import { t } from "@/domain/i18n";
import { GENDER_OPTIONS, type Gender } from "@/domain/moods";
import type { SpaceMode } from "@/domain/types";
import type { PayloadOf } from "@/services/api/contract";
import { telegram } from "@/services/telegram";
import { Field, SegmentedPills } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { NativeSelect, NativeSelectOption } from "@/shared/ui/native-select";
import { SheetTitle } from "@/shared/ui/sheet";
import { Switch } from "@/shared/ui/switch";
import { useLocaleStore } from "@/stores/locale";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import InviteSection from "./InviteSection.vue";

const session = useSessionStore();
const sheets = useSheetsStore();
const locale = useLocaleStore();
/** Applies at once and is remembered on its own, apart from «Сохранить» */
const language = computed({
  get: () => locale.choice,
  set: (v: string) => void locale.choose(v),
});
const me = session.app.me;
const couple = computed(() => session.app.couple);

const myName = ref(session.meName);
const gender = ref<Gender | "">(me.gender ?? "");
const petName = ref(session.petName);
const startDate = ref(couple.value.start_date);
const notifyOn = ref(me.notify !== false);
const spaceMode = ref<SpaceMode | "">(session.friends ? "friends" : "pair");

const modeOptions = computed<readonly { value: SpaceMode; label: string }[]>(() => [
  { value: "pair", label: t("settings.mode.pair") },
  { value: "friends", label: t("settings.mode.friends") },
]);
const leaveArmed = ref(false);

const privacyUrl = new URL("privacy.html", location.href).href;

const leaveLabel = computed(() => {
  if (leaveArmed.value)
    return session.solo ? t("settings.leave.confirmSolo") : t("settings.leave.confirm");
  if (session.solo) return t("settings.leave.restart");
  return session.friends ? t("settings.leave.leaveSpace") : t("settings.leave.leavePair");
});

async function save() {
  const payload: PayloadOf<"couple.update"> = {
    my_name: myName.value.trim(),
    pet_name: petName.value.trim(),
  };
  let message = t("settings.saved");
  if (!session.solo) {
    const nextMode = spaceMode.value || "pair";
    if (nextMode !== session.mode) {
      payload.mode = nextMode;
      message = nextMode === "friends" ? t("settings.nowFriends") : t("settings.nowPair");
    }
    if (nextMode === "pair") payload.start_date = startDate.value.trim();
    if (notifyOn.value !== (me.notify !== false)) payload.notify = notifyOn.value;
  }
  if (gender.value && gender.value !== me.gender) payload.gender = gender.value;
  if (await session.act("couple.update", payload, message)) sheets.close();
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
    ? t("settings.leave.cleared")
    : session.gendered(session.friends ? "settings.leave.left" : "settings.leave.leftPair");
  sheets.close();
  await session.act("couple.leave", {}, msg);
}
</script>

<template>
  <SheetTitle>{{
    session.isPair ? t("settings.title.pair") : t("settings.title.other")
  }}</SheetTitle>
  <Field :label="t('settings.myName')">
    <Input v-model="myName" type="text" maxlength="30" />
  </Field>
  <Field as="div" :label="t('settings.gender')">
    <SegmentedPills
      v-model="gender"
      :options="GENDER_OPTIONS"
      :label="t('settings.gender')"
      class="mt-0.5"
    />
  </Field>
  <Field :label="t('settings.petName')">
    <Input v-model="petName" type="text" maxlength="30" />
  </Field>
  <template v-if="!session.solo">
    <Field as="div" :label="t('settings.mode.label')">
      <SegmentedPills
        v-model="spaceMode"
        :options="modeOptions"
        :label="t('settings.mode.label')"
        class="mt-0.5"
      />
    </Field>
    <Field v-if="spaceMode !== 'friends'" :label="t('settings.startDate')">
      <Input v-model="startDate" type="date" :max="today()" />
    </Field>
    <label class="text-foreground flex cursor-pointer items-center gap-3 text-sm font-semibold">
      <Switch v-model="notifyOn" />
      <span>{{ t("settings.notify", { name: session.partnerName }) }}</span>
    </label>
  </template>
  <Field :label="t('settings.language.label')">
    <NativeSelect v-model="language">
      <NativeSelectOption v-for="o in locale.options" :key="o.value" :value="o.value">
        {{ o.label }}
      </NativeSelectOption>
    </NativeSelect>
  </Field>
  <div class="flex flex-col gap-2">
    <Button @click="save">{{ t("common.actions.save") }}</Button>
    <Button variant="outline" @click="sheets.close()">{{ t("common.actions.close") }}</Button>
  </div>
  <InviteSection />
  <div class="border-primary/10 flex flex-col items-start border-t pt-2">
    <Button
      as="a"
      variant="link"
      class="text-muted-foreground no-underline"
      href="privacy.html"
      @click="openPrivacy"
    >
      {{ t("settings.privacy") }}
    </Button>
    <Button variant="link" @click="leave">{{ leaveLabel }}</Button>
  </div>
</template>
