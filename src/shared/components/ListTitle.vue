<script setup lang="ts">
/** Primary line of a ListRow; strikes through when the row is done */
</script>

<template>
  <div class="group-data-done:text-muted-foreground font-bold group-data-done:line-through">
    <slot />
  </div>
</template>
