<script setup lang="ts">
import ChoreList from "./ChoreList.vue";
import { useHomeUiStore } from "./homeUi";
import ShopList from "./ShopList.vue";

const homeUi = useHomeUiStore();
</script>

<template>
  <ShopList v-if="homeUi.section === 'shop'" />
  <ChoreList v-else />
</template>
