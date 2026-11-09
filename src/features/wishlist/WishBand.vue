<script setup lang="ts">
import { computed } from "vue";
import type { Who } from "@/domain/types";
import { SegmentedPills } from "@/shared/components";
import { useSessionStore } from "@/stores/session";
import { useWishUiStore } from "./wishUi";

const session = useSessionStore();
const wishUi = useWishUiStore();

const options = computed(() => [
  { value: "me" as const, label: "Хочу я" },
  { value: "partner" as const, label: `Хочет ${session.partnerName}` },
]);
const who = computed({
  get: () => wishUi.who,
  set: (v: Who | "") => v && wishUi.showList(v),
});
</script>

<template>
  <h1>{{ session.solo ? "Мой вишлист" : "Наш вишлист" }}</h1>
  <SegmentedPills v-if="!session.solo" v-model="who" :options inverse center label="Чей список" />
</template>
