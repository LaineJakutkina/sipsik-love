<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppShell from "@/app/AppShell.vue";
import { today } from "@/domain/dates";
import { t, type MessageKey } from "@/domain/i18n";
import { GENDER_OPTIONS, type Gender, type MoodId } from "@/domain/moods";
import CatStage from "@/game/vue/CatStage.vue";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { DateField, Field, Hint, SegmentedPills } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSessionStore } from "@/stores/session";

type Step = "start" | "create" | "friends" | "solo" | "join";

const STEPS: Record<Step, { mood: MoodId; title: MessageKey }> = {
  start: { mood: "happy", title: "onboarding.title.start" },
  create: { mood: "happy", title: "onboarding.title.create" },
  friends: { mood: "happy", title: "onboarding.title.friends" },
  solo: { mood: "happy", title: "onboarding.title.solo" },
  join: { mood: "neutral", title: "onboarding.title.join" },
};

const session = useSessionStore();
const router = useRouter();

const step = ref<Step>("start");
const name = ref(session.meName);
const gender = ref<Gender | "">("");
const start = ref("");
/** Until the user types a name of their own, the default follows the language */
const petInput = ref<string>();
const pet = computed({
  get: () => petInput.value ?? t("onboarding.form.defaultPet"),
  set: (v: string) => (petInput.value = v),
});
const code = ref("");

function welcome() {
  telegram.haptic("success");
  telegram.requestWriteAccess();
}

type FormStep = Exclude<Step, "start" | "join">;

const CREATE_LABEL: Record<FormStep, MessageKey> = {
  create: "onboarding.submit.create",
  friends: "onboarding.submit.friends",
  solo: "onboarding.submit.solo",
};

/** The create form is shown only on these steps */
const formStep = computed(() => step.value as FormStep);

async function create(kind: FormStep) {
  if (kind === "create" && !start.value) return notify(t("onboarding.needStart"));
  const modePayload =
    kind === "solo"
      ? { solo: true }
      : kind === "friends"
        ? { mode: "friends" as const }
        : { start_date: start.value };
  const ok = await session.act("couple.create", {
    ...modePayload,
    pet_name: pet.value.trim(),
    my_name: name.value.trim(),
    gender: gender.value || undefined,
  });
  if (!ok) return;
  welcome();
  await router.replace({ name: "us" });
}

async function join() {
  const c = code.value.trim();
  if (!c) return notify(t("onboarding.needCode"));
  if (!(await session.act("couple.join", { code: c }))) return;
  welcome();
  notify(session.togetherMessage);
}
</script>

<template>
  <AppShell>
    <template #band>
      <CatStage :look="{ mood: STEPS[step].mood, worn: {} }" />
      <h1>{{ t(STEPS[step].title, { name: session.meName }) }}</h1>
    </template>

    <Card v-if="step === 'start'" class="gap-3.5">
      <p>{{ t("onboarding.intro") }}</p>
      <Button @click="step = 'create'">{{ t("onboarding.choose.pair") }}</Button>
      <Button @click="step = 'friends'">{{ t("onboarding.choose.friends") }}</Button>
      <Button variant="outline" @click="step = 'solo'">{{ t("onboarding.choose.solo") }}</Button>
      <Button variant="outline" @click="step = 'join'">{{ t("onboarding.choose.join") }}</Button>
    </Card>

    <Card v-else-if="step === 'join'" as="form" class="gap-2" @submit.prevent="join">
      <p class="text-muted-foreground text-[13px]">
        {{ t("onboarding.join.text") }}
      </p>
      <Input
        v-model="code"
        :placeholder="t('onboarding.join.placeholder')"
        maxlength="12"
        autocapitalize="characters"
        autocomplete="off"
        :aria-label="t('onboarding.join.aria')"
      />
      <Button type="submit">{{ t("onboarding.join.submit") }}</Button>
      <Button type="button" variant="outline" @click="step = 'start'">{{
        t("common.actions.back")
      }}</Button>
    </Card>

    <Card v-else as="form" class="gap-2" @submit.prevent="create(formStep)">
      <p v-if="step === 'solo'" class="text-muted-foreground text-[13px]">
        {{ t("onboarding.form.soloText") }}
      </p>
      <p v-else-if="step === 'friends'" class="text-muted-foreground text-[13px]">
        {{ t("onboarding.form.friendsText") }}
      </p>
      <Field :label="t('onboarding.form.name')">
        <Input v-model="name" maxlength="30" />
      </Field>
      <Field :label="t('onboarding.form.gender')" as="div">
        <SegmentedPills
          v-model="gender"
          :options="GENDER_OPTIONS"
          :label="t('onboarding.form.gender')"
        />
      </Field>
      <Field v-if="step === 'create'" :label="t('onboarding.form.startDate')">
        <DateField v-model="start" :placeholder="t('onboarding.form.pickDate')" :max="today()" />
        <Hint>{{ t("onboarding.form.startHint") }}</Hint>
      </Field>
      <Field :label="t('onboarding.form.petName')">
        <Input v-model="pet" maxlength="30" />
      </Field>
      <Button type="submit">{{ t(CREATE_LABEL[formStep]) }}</Button>
      <Button type="button" variant="outline" @click="step = 'start'">{{
        t("common.actions.back")
      }}</Button>
    </Card>
  </AppShell>
</template>
