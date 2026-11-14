<script setup lang="ts">
import { SectionSwap } from "@/shared/components";
import MemoriesSection from "./sections/MemoriesSection.vue";
import ThanksSection from "./sections/ThanksSection.vue";
import TodaySection from "./sections/TodaySection.vue";
import { useUsUiStore } from "./usUi";

/** “Мы” tab body; the band above switches the segment */
const ui = useUsUiStore();
</script>

<template>
  <SectionSwap :id="ui.segment">
    <MemoriesSection v-if="ui.segment === 'mem'" />
    <ThanksSection v-else-if="ui.segment === 'thanks'" />
    <TodaySection v-else />
  </SectionSwap>
</template>
