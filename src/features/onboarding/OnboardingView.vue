<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import AppShell from "@/app/AppShell.vue";
import { today } from "@/domain/dates";
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

const STEPS: Record<Step, { mood: MoodId; title: (name: string) => string }> = {
  start: { mood: "happy", title: (name) => `Привет, ${name}!` },
  create: { mood: "happy", title: () => "Новая пара" },
  friends: { mood: "happy", title: () => "Мы друзья" },
  solo: { mood: "happy", title: () => "Ты и Сипсик" },
  join: { mood: "neutral", title: () => "По приглашению" },
};

const session = useSessionStore();
const router = useRouter();

const step = ref<Step>("start");
const name = ref(session.meName);
const gender = ref<Gender | "">("");
const start = ref("");
const pet = ref("Сипсик");
const code = ref("");

function welcome() {
  telegram.haptic("success");
  telegram.requestWriteAccess();
}

type FormStep = Exclude<Step, "start" | "join">;

const CREATE_LABEL: Record<FormStep, string> = {
  create: "Создать пару",
  friends: "Создать",
  solo: "Начать",
};

/** The create form is shown only on these steps */
const formStep = computed(() => step.value as FormStep);

async function create(kind: FormStep) {
  if (kind === "create" && !start.value) return notify("Укажи, с какого дня вы вместе");
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
  if (!c) return notify("Введи код");
  if (!(await session.act("couple.join", { code: c }))) return;
  welcome();
  notify(session.togetherMessage);
}
</script>

<template>
  <AppShell>
    <template #band>
      <CatStage :look="{ mood: STEPS[step].mood, worn: {} }" />
      <h1>{{ STEPS[step].title(session.meName) }}</h1>
    </template>

    <Card v-if="step === 'start'" class="gap-3.5">
      <p>
        Сипсик Love — уютное пространство с котиком, который собирает вещи за тапы. Внутри
        вишлист с фото, календарь с днями рождения, покупки, дела и записки-сюрпризы. Для пары,
        для друзей или только для тебя.
      </p>
      <Button @click="step = 'create'">Мы пара</Button>
      <Button @click="step = 'friends'">Мы друзья</Button>
      <Button variant="outline" @click="step = 'solo'">Только я и Сипсик</Button>
      <Button variant="outline" @click="step = 'join'">У меня есть приглашение</Button>
    </Card>

    <Card v-else-if="step === 'join'" as="form" class="gap-2" @submit.prevent="join">
      <p class="text-muted-foreground text-[13px]">
        Проще всего перейти по ссылке, которую тебе прислали. Если есть только код из шести
        символов, введи его здесь.
      </p>
      <Input
        v-model="code"
        placeholder="Например, K7F2QX"
        maxlength="12"
        autocapitalize="characters"
        autocomplete="off"
        aria-label="Код приглашения"
      />
      <Button type="submit">Присоединиться</Button>
      <Button type="button" variant="outline" @click="step = 'start'">Назад</Button>
    </Card>

    <Card v-else as="form" class="gap-2" @submit.prevent="create(formStep)">
      <p v-if="step === 'solo'" class="text-muted-foreground text-[13px]">
        Твой котик, вишлист, покупки, дела, календарь, дневник благодарности и записки себе в
        будущее. Всё это только для тебя.
      </p>
      <p v-else-if="step === 'friends'" class="text-muted-foreground text-[13px]">
        Общий котик, вишлисты с фото, календарь с днями рождения, покупки и записки-сюрпризы для
        двоих друзей. После создания пригласишь друга по ссылке.
      </p>
      <Field label="Как тебя зовут">
        <Input v-model="name" maxlength="30" />
      </Field>
      <Field label="Как к тебе обращаться" as="div">
        <SegmentedPills v-model="gender" :options="GENDER_OPTIONS" label="Как к тебе обращаться" />
      </Field>
      <Field v-if="step === 'create'" label="Дата начала отношений">
        <DateField v-model="start" placeholder="Выбери дату" :max="today()" />
        <Hint>
          С этого дня Сипсик считает, сколько дней вы вместе. Потом можно поменять в настройках
        </Hint>
      </Field>
      <Field label="Имя котика">
        <Input v-model="pet" maxlength="30" />
      </Field>
      <Button type="submit">{{ CREATE_LABEL[formStep] }}</Button>
      <Button type="button" variant="outline" @click="step = 'start'">Назад</Button>
    </Card>
  </AppShell>
</template>
