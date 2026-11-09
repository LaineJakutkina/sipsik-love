<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { toggleVariants } from "@/shared/ui/toggle";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { useThanks } from "../useThanks";

/** Write a thanks; chips append ready-made endings */
defineProps<{
  title: string;
  placeholder: string;
  chips: readonly string[];
  submit: string;
}>();

const { add } = useThanks();
const text = ref("");
const field = useTemplateRef<{ $el: HTMLTextAreaElement }>("field");

function addChip(chip: string) {
  const t = text.value.trim();
  text.value = (t ? `${t} ` : "") + chip;
  field.value?.$el.focus();
}

function send() {
  if (add(text.value)) text.value = "";
}
</script>

<template>
  <Card as="form" class="gap-2" @submit.prevent="send">
    <CardTitle>{{ title }}</CardTitle>
    <Textarea ref="field" v-model="text" rows="2" maxlength="500" :placeholder="placeholder" />
    <div class="mt-0.5 mb-0.5 flex flex-wrap gap-1.5">
      <button
        v-for="c in chips"
        :key="c"
        type="button"
        :class="toggleVariants({ variant: 'chip', size: 'sm' })"
        @click="addChip(c)"
      >
        {{ c }}
      </button>
    </div>
    <Button type="submit">{{ submit }}</Button>
  </Card>
</template>
