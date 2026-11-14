<script setup lang="ts">
import { computed } from "vue";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";

/** Full-screen photo viewer; tap anywhere to close */
const props = defineProps<{ url: string | null }>();
const emit = defineEmits<{ close: [] }>();

/** The photo stays while the viewer fades out */
const shown = computed<string | null>((prev) => props.url ?? prev ?? null);
</script>

<template>
  <Dialog :open="!!url" @update:open="(o) => !o && emit('close')">
    <DialogContent
      :aria-describedby="undefined"
      overlay-class="bg-[rgb(10_8_16/.85)]"
      class="grid size-full place-items-center p-4"
      @click="emit('close')"
    >
      <DialogTitle class="sr-only">Фото</DialogTitle>
      <img v-if="shown" :src="shown" alt="" class="max-h-full max-w-full rounded-[18px]" />
    </DialogContent>
  </Dialog>
</template>
