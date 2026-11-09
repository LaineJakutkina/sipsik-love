<script setup lang="ts">
import { ref } from "vue";
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

type Step = "start" | "create" | "solo" | "join";

const STEPS: Record<Step, { mood: MoodId; title: (name: string) => string }> = {
  start: { mood: "happy", title: (name) => `Привет, ${name}!` },
  create: { mood: "happy", title: () => "Новая пара" },
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

async function create(solo: boolean) {
  if (!solo && !start.value) return notify("Укажи, с какого дня вы вместе");
  const ok = await session.act("couple.create", {
    ...(solo ? { solo: true } : { start_date: start.value }),
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
  notify("Вы теперь пара!");
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
        Сипсик Love — пространство для вас двоих: общий котик, который собирает вещи за тапы,
        вишлист с фото, календарь с днями рождения, покупки, дела и записки-сюрпризы.
      </p>
      <Button @click="step = 'create'">Создать пару</Button>
      <Button variant="outline" @click="step = 'join'">У меня есть приглашение</Button>
      <Button variant="outline" @click="step = 'solo'">У меня нет пары, буду с Сипсиком</Button>
    </Card>

    <Card v-else-if="step === 'join'" as="form" class="gap-2" @submit.prevent="join">
      <p class="text-muted-foreground text-[13px]">
        Проще всего перейти по ссылке, которую прислал партнёр. Если есть только код из шести
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

    <Card v-else as="form" class="gap-2" @submit.prevent="create(step === 'solo')">
      <p v-if="step === 'solo'" class="text-muted-foreground text-[13px]">
        Котик, вишлист, покупки, дела, календарь и записки себе в будущее. Если появится пара, её
        можно будет пригласить в настройках, и всё станет общим.
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
      <Button type="submit">{{ step === "solo" ? "Начать" : "Создать пару" }}</Button>
      <Button type="button" variant="outline" @click="step = 'start'">Назад</Button>
    </Card>
  </AppShell>
</template>
