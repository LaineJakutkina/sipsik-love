<script setup lang="ts">
import { ref } from "vue";
import type { Photo } from "@/domain/types";
import { readPhoto } from "@/services/photo";
import { notify } from "@/services/notify";

/** Dashed “add a photo” tile; resizes the picked image and emits it */
defineProps<{ title: string; subtitle?: string; preview?: string | null }>();
const emit = defineEmits<{ pick: [photo: Photo] }>();
const reading = ref(false);

async function onChange(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  reading.value = true;
  try {
    emit("pick", await readPhoto(file));
  } catch {
    notify("Не получилось открыть это фото");
  } finally {
    reading.value = false;
  }
}
</script>

<template>
  <label
    class="border-primary relative flex cursor-pointer items-center gap-3 rounded-[18px] border-2 border-dashed p-2.5"
    :aria-busy="reading"
  >
    <input type="file" accept="image/*" class="sr-only" @change="onChange" />
    <span
      class="bg-muted text-muted-foreground grid size-16 flex-none place-items-center overflow-hidden rounded-[14px] text-[26px] font-light"
    >
      <img v-if="preview" :src="preview" alt="" class="size-full object-cover" />
      <template v-else>+</template>
    </span>
    <span class="min-w-0">
      <b class="block text-sm">{{ title }}</b>
      <span v-if="subtitle" class="text-muted-foreground text-xs font-semibold">{{
        subtitle
      }}</span>
    </span>
  </label>
</template>
