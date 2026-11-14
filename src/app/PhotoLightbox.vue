<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";

/** Full-screen photo viewer; tap anywhere to close */
const props = defineProps<{ url: string | null }>();
const emit = defineEmits<{ close: [] }>();

/** The photo stays while the viewer fades out */
const shown = computed<string | null>((prev) => props.url ?? prev ?? null);

/** A skeleton holds the place until the full-size photo arrives */
const loaded = ref(false);
watch(shown, () => (loaded.value = false));
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
      <Skeleton
        v-if="shown && !loaded"
        tone="overlay"
        class="aspect-square w-full rounded-[18px]"
      />
      <img
        v-if="shown"
        v-show="loaded"
        :src="shown"
        alt=""
        class="max-h-full max-w-full animate-in rounded-[18px] fade-in-0 zoom-in-95 duration-200 ease-out-soft"
        @load="loaded = true"
        @error="loaded = true"
      />
    </DialogContent>
  </Dialog>
</template>
