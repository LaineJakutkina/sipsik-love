<script setup lang="ts">
import { useSessionStore } from "@/stores/session";

const session = useSessionStore();
</script>

<template>
  <h1>Магазин</h1>
  <p class="self-center text-center text-[13px] font-bold opacity-95">
    Облики для {{ session.petName }}: окрасы, звери и говорящие котики
  </p>
</template>
