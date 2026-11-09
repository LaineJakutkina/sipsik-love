<script setup lang="ts">
import { ref } from "vue";
import { notify } from "@/services/notify";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { toggleVariants } from "@/shared/ui/toggle";

/** Quick reply chips plus a free-text answer, on a navy banner */
defineProps<{ replies: readonly string[]; maxlength: number }>();
const emit = defineEmits<{ reply: [text: string] }>();

const text = ref("");
const chip = toggleVariants({ variant: "chip-inverse", size: "sm" });

function submit(preset?: string) {
  const r = preset || text.value.trim();
  if (!r) {
    notify("Выбери ответ или напиши своё");
    return;
  }
  emit("reply", r);
}
</script>

<template>
  <div class="mt-3 mb-1 flex flex-wrap gap-1.5">
    <button v-for="r in replies" :key="r" type="button" :class="chip" @click="submit(r)">
      {{ r }}
    </button>
  </div>
  <div class="mt-2 flex gap-2">
    <Input
      v-model="text"
      type="text"
      class="text-foreground flex-1"
      placeholder="Или напиши своё"
      :maxlength="maxlength"
    />
    <Button variant="secondary" class="flex-none" @click="submit()">Ответить</Button>
  </div>
</template>
