<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch, type HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * A photo that fills its box. A skeleton pulses until the picture arrives, then the
 * picture fades in; an image the browser already has shows at once, without a fade.
 */
const props = defineProps<{ src: string; alt?: string; class?: HTMLAttributes["class"] }>();

const img = useTemplateRef<HTMLImageElement>("img");
const loaded = ref(false);
const fade = ref(false);

onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth) loaded.value = true;
  else fade.value = true;
});
watch(
  () => props.src,
  () => {
    loaded.value = false;
    fade.value = true;
  },
);
</script>

<template>
  <span :class="cn('relative block overflow-hidden', props.class)">
    <Skeleton v-if="!loaded" tone="tile" class="absolute inset-0 rounded-none" />
    <img
      ref="img"
      :src
      :alt="alt ?? ''"
      loading="lazy"
      decoding="async"
      :class="
        cn(
          'absolute inset-0 size-full object-cover',
          fade && 'ease-out-soft transition-opacity duration-300',
          !loaded && 'opacity-0',
        )
      "
      @load="loaded = true"
      @error="loaded = true"
    />
  </span>
</template>
