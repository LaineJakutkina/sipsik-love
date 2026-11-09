<script setup lang="ts">
import { computed, ref } from "vue";
import { isAnimalOffer } from "@/domain/coats";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { errorMessage } from "@/services/api/client";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { Button } from "@/shared/ui/button";
import { SheetTitle } from "@/shared/ui/sheet";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { useCoatActions } from "./coatActions";

const props = defineProps<{ id: string }>();

const session = useSessionStore();
const sheets = useSheetsStore();
const { buyCoat } = useCoatActions();

const coat = computed(() => session.app.coats?.find((x) => x.id === props.id));
const animal = computed(() => !!coat.value && isAnimalOffer(coat.value));
const title = computed(() => {
  const name = coat.value?.name.toLowerCase() ?? "";
  return animal.value ? `${session.petName} теперь ${name}` : `${session.petName}: ${name} окрас`;
});

type BuyState = "idle" | "opening" | "retry";
const state = ref<BuyState>("idle");

async function buy() {
  if (!telegram.canPay) {
    notify("Обнови Telegram, чтобы покупать за звёзды");
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
      {{ animal ? "Зверёк" : "Окрас" }}
      {{ session.solo ? "останется с тобой" : "достанется вам обоим" }} навсегда. Вещи и эмоции
      сохранятся, вернуть котика можно в любой момент.
    </p>
    <Button variant="secondary" :disabled="state === 'opening'" @click="buy">
      <template v-if="state === 'opening'">Открываем оплату…</template>
      <template v-else-if="state === 'retry'">Попробовать ещё раз</template>
      <template v-else>Купить за {{ coat.price }} ⭐</template>
    </Button>
    <Button variant="outline" @click="sheets.close()">Не сейчас</Button>
    <p class="text-muted-foreground text-center text-[13px]">
      Оплата звёздами Telegram. Вопрос о покупке: /paysupport в боте
    </p>
  </template>
  <SheetTitle v-else class="sr-only">Окрас</SheetTitle>
</template>
