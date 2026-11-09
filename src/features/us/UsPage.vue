<script setup lang="ts">
import MemoriesSection from "./sections/MemoriesSection.vue";
import ThanksSection from "./sections/ThanksSection.vue";
import TodaySection from "./sections/TodaySection.vue";
import { useUsUiStore } from "./usUi";

/** “Мы” tab body; the band above switches the segment */
const ui = useUsUiStore();
</script>

<template>
  <MemoriesSection v-if="ui.segment === 'mem'" />
  <ThanksSection v-else-if="ui.segment === 'thanks'" />
  <TodaySection v-else />
</template>
