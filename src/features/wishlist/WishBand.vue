<script setup lang="ts">
import { useSessionStore } from "@/stores/session";

const session = useSessionStore();
</script>

<template>
  <h1 class="sr-only">{{ session.solo ? "Мой вишлист" : "Наш вишлист" }}</h1>
</template>
