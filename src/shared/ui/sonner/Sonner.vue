<script lang="ts" setup>
import { Toaster as Sonner } from "vue-sonner";
</script>

<!-- Peach pill toast above the tab bar, like the original app. Only one at a time. -->
<template>
  <Sonner
    position="bottom-center"
    :visible-toasts="1"
    :duration="2600"
    :offset="{ bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }"
    :mobile-offset="{ bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))' }"
    :toast-options="{
      unstyled: true,
      class:
        'mx-auto w-max max-w-[calc(100vw-32px)] rounded-full border-2 border-primary bg-secondary px-[18px] py-2.5 text-center text-sm font-extrabold text-secondary-foreground',
    }"
  />
</template>
