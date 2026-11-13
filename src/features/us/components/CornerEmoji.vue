<script setup lang="ts">
/** Big faint emoji tucked into the bottom-right corner of a `relative overflow-hidden` card */
defineProps<{ emoji: string }>();
</script>

<template>
  <span
    class="pointer-events-none absolute -right-2 -bottom-3 rotate-12 text-[58px] leading-none opacity-25 select-none"
    aria-hidden="true"
  >
    {{ emoji }}
  </span>
</template>
