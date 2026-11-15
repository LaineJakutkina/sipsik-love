<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from "vue";
import { QUICK_SHOPPING } from "@/domain/catalog";
import { t } from "@/domain/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useHousehold } from "./useHousehold";

/** “Что купить” input with quick chips; `inSheet` focuses it and skips the toast */
const props = defineProps<{ inSheet?: boolean }>();
const household = useHousehold();
const title = ref("");
const input = useTemplateRef<{ $el: HTMLInputElement }>("input");

async function submit() {
  const item = title.value.trim();
  if (!item) return;
  household.addShop(item, props.inSheet);
  title.value = "";
  await nextTick();
  input.value?.$el.focus();
}

onMounted(() => {
  if (props.inSheet) setTimeout(() => input.value?.$el.focus(), 50);
});
</script>

<template>
  <form class="flex gap-2" @submit.prevent="submit">
    <Input
      ref="input"
      v-model="title"
      :placeholder="t('home.shop.placeholder')"
      maxlength="80"
      class="flex-1"
    />
    <Button type="submit" class="flex-none">{{ t("common.actions.add") }}</Button>
  </form>
  <div class="mt-2.5 flex flex-wrap gap-1.5">
    <button
      v-for="q in QUICK_SHOPPING"
      :key="q"
      type="button"
      class="bg-muted press rounded-full px-3 py-1.5 text-[13px] font-semibold"
      @click="household.addShop(q, inSheet)"
    >
      + {{ q }}
    </button>
  </div>
</template>
