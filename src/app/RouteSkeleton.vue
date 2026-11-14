<script setup lang="ts">
import { Skeleton } from "@/shared/ui/skeleton";

/** Placeholder for a screen whose code is still on its way: the band gets a pill bar, the page a few cards */
defineProps<{ band?: boolean }>();
</script>

<template>
  <div v-if="band" class="flex flex-col gap-3.5" aria-busy="true">
    <Skeleton tone="band" class="h-7 w-1/2" />
    <Skeleton tone="band" class="h-[39px] w-full rounded-full" />
  </div>
  <div v-else class="flex flex-col gap-3.5" aria-busy="true">
    <Skeleton class="h-32 rounded-lg" />
    <Skeleton class="h-20 rounded-lg" />
    <Skeleton class="h-20 rounded-lg" />
  </div>
</template>
