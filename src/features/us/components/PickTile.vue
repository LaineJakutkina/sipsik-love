<script setup lang="ts">
import { cn } from "@/shared/lib/utils";

/**
 * Square-ish tile in the item / coat grids: picture, name, small caption.
 * `on` paints it peach; `locked` renders a dashed, non-interactive tile.
 */
const props = defineProps<{ name: string; caption: string; on?: boolean; locked?: boolean }>();
defineEmits<{ select: [] }>();
</script>

<template>
  <component
    :is="locked ? 'div' : 'button'"
    :type="locked ? undefined : 'button'"
    :aria-pressed="locked ? undefined : !!on"
    :class="
      cn(
        'group bg-muted flex min-w-0 flex-col items-center gap-[3px] rounded-[18px] border-[1.5px] border-transparent px-1.5 pt-2.5 pb-2.5 text-center',
        props.on && 'bg-secondary',
        props.locked && 'bg-background border-grey/60 border-dashed',
      )
    "
    :data-locked="locked || undefined"
    @click="!locked && $emit('select')"
  >
    <slot />
    <b class="text-xs leading-[1.2] group-data-locked:text-muted-foreground">{{ name }}</b>
    <span
      :class="
        cn(
          'tabular text-[11px] font-semibold',
          props.on ? 'text-foreground' : 'text-muted-foreground',
        )
      "
    >
      {{ caption }}
    </span>
  </component>
</template>
