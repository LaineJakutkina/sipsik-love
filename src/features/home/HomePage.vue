<script setup lang="ts">
import { SectionSwap } from "@/shared/components";
import ChoreList from "./ChoreList.vue";
import { useHomeUiStore } from "./homeUi";
import ShopList from "./ShopList.vue";

const homeUi = useHomeUiStore();
</script>

<template>
  <SectionSwap :id="homeUi.section">
    <ShopList v-if="homeUi.section === 'shop'" />
    <ChoreList v-else />
  </SectionSwap>
</template>
