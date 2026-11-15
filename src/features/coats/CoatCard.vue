<script setup lang="ts">
import { computed } from "vue";
import { isAnimalOffer, isCoatId, isTalkingOffer } from "@/domain/coats";
import { formatNumber, t } from "@/domain/i18n";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import CoatButton from "./CoatButton.vue";
import { useCoatActions } from "./coatActions";

/** Coat pickers in the shop (cats, then other animals): owned coats switch instantly, others open the purchase sheet */
const session = useSessionStore();
const { chooseCoat } = useCoatActions();

const list = computed(() => (session.app.coats ?? []).filter((c) => isCoatId(c.id)));
const cats = computed(() => list.value.filter((c) => !isAnimalOffer(c) && !isTalkingOffer(c)));
const animals = computed(() => list.value.filter(isAnimalOffer));
const owned = computed(() => session.app.couple.owned ?? ["black"]);
const current = computed(() => session.app.couple.coat || "black");
</script>

<template>
  <Card v-if="cats.length">
    <div class="flex items-center justify-between gap-2">
      <CardTitle>{{ t("coats.card.coats") }}</CardTitle>
      <span class="text-muted-foreground text-[13px]">{{
        t("coats.card.choice", { n: formatNumber(cats.length) })
      }}</span>
    </div>
    <div class="mt-3 grid grid-cols-3 gap-2">
      <CoatButton
        v-for="c in cats"
        :key="c.id"
        :coat="c"
        :on="current === c.id"
        :owned="owned.includes(c.id) || !c.price"
        @choose="chooseCoat(c.id)"
      />
    </div>
  </Card>
  <Card v-if="animals.length">
    <div class="flex items-center justify-between gap-2">
      <CardTitle>{{ t("coats.card.animals") }}</CardTitle>
      <span class="text-muted-foreground text-[13px]">{{ t("coats.card.animalsNote") }}</span>
    </div>
    <div class="mt-3 grid grid-cols-3 gap-2">
      <CoatButton
        v-for="c in animals"
        :key="c.id"
        :coat="c"
        :on="current === c.id"
        :owned="owned.includes(c.id) || !c.price"
        @choose="chooseCoat(c.id)"
      />
    </div>
  </Card>
</template>
