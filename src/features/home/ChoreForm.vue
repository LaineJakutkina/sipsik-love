<script setup lang="ts">
import { ref } from "vue";
import { CHORE_FREQUENCIES, choreFrequencyLabel } from "@/domain/catalog";
import { t } from "@/domain/i18n";
import type { Who } from "@/domain/types";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { NativeSelect, NativeSelectOption } from "@/shared/ui/native-select";
import { useSessionStore } from "@/stores/session";
import { useHousehold } from "./useHousehold";

/** «Новое дело» panel inside the chores card */
const emit = defineEmits<{ added: [] }>();
const session = useSessionStore();
const household = useHousehold();

const title = ref("");
const who = ref<Who>("me");
const freq = ref<string>(CHORE_FREQUENCIES[0]);

function submit() {
  if (!household.addChore(title.value.trim(), who.value, freq.value)) return;
  title.value = "";
  who.value = "me";
  freq.value = CHORE_FREQUENCIES[0];
  emit("added");
}
</script>

<template>
  <form class="bg-muted flex flex-col gap-2 rounded-2xl p-3" @submit.prevent="submit">
    <Input v-model="title" :placeholder="t('home.choreForm.placeholder')" maxlength="80" />
    <div class="grid grid-cols-2 gap-2">
      <NativeSelect v-model="who" :aria-label="t('home.choreForm.who')">
        <NativeSelectOption value="me">{{ session.meName }}</NativeSelectOption>
        <NativeSelectOption v-if="session.app.partner" value="partner">
          {{ session.partnerName }}
        </NativeSelectOption>
      </NativeSelect>
      <NativeSelect v-model="freq" :aria-label="t('home.choreForm.freq')">
        <NativeSelectOption v-for="f in CHORE_FREQUENCIES" :key="f" :value="f">
          {{ choreFrequencyLabel(f) }}
        </NativeSelectOption>
      </NativeSelect>
    </div>
    <Button type="submit">{{ t("home.choreForm.submit") }}</Button>
  </form>
</template>
