<script setup lang="ts">
import { computed, ref } from "vue";
import { isAnimalOffer } from "@/domain/coats";
import { formatLocale, formatNumber, t } from "@/domain/i18n";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { errorMessage } from "@/services/api/client";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { Button } from "@/shared/ui/button";
import { SheetTitle } from "@/shared/ui/sheet";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useCoatActions } from "./coatActions";
import { coatName } from "./coatName";

const props = defineProps<{ id: string }>();

const session = useSessionStore();
const sheets = useSheetsStore();
const { buyCoat } = useCoatActions();

const coat = computed(() => session.app.coats?.find((x) => x.id === props.id));
const animal = computed(() => !!coat.value && isAnimalOffer(coat.value));
const title = computed(() => {
  const name = coat.value ? coatName(coat.value).toLocaleLowerCase(formatLocale()) : "";
  const params = { pet: session.petName, name };
  return animal.value ? t("coats.sheet.titleAnimal", params) : t("coats.sheet.titleCoat", params);
});
const forever = computed(() => {
  if (animal.value)
    return session.solo ? t("coats.sheet.foreverAnimalSolo") : t("coats.sheet.foreverAnimalPair");
  return session.solo ? t("coats.sheet.foreverCoatSolo") : t("coats.sheet.foreverCoatPair");
});

type BuyState = "idle" | "opening" | "retry";
const state = ref<BuyState>("idle");

async function buy() {
  if (!telegram.canPay) {
    notify(t("coats.sheet.updateTelegram"));
    return;
  }
  state.value = "opening";
  try {
    await buyCoat(props.id);
  } catch (e) {
    notify(errorMessage(e));
    state.value = "retry";
  }
}
</script>

<template>
  <template v-if="coat">
    <div class="bg-accent rounded-[24px] p-2.5">
      <CharacterThumb
        kind="full"
        mood="happy"
        :coat="coat.id"
        :worn="session.app.couple.worn"
        :width="480"
        class="block h-auto w-full"
      />
    </div>
    <SheetTitle class="text-center">{{ title }}</SheetTitle>
    <p class="text-muted-foreground text-center text-[13px]">
      {{ forever }}
    </p>
    <Button variant="secondary" :disabled="state === 'opening'" @click="buy">
      <template v-if="state === 'opening'">{{ t("coats.sheet.opening") }}</template>
      <template v-else-if="state === 'retry'">{{ t("coats.sheet.retry") }}</template>
      <template v-else>{{ t("coats.sheet.buy", { price: formatNumber(coat.price) }) }}</template>
    </Button>
    <Button variant="outline" @click="sheets.close()">{{ t("coats.sheet.notNow") }}</Button>
    <p class="text-muted-foreground text-center text-[13px]">
      {{ t("coats.sheet.payNote") }}
    </p>
  </template>
  <SheetTitle v-else class="sr-only">{{ t("coats.sheet.fallbackTitle") }}</SheetTitle>
</template>
