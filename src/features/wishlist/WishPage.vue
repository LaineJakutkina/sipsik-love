<script setup lang="ts">
import { LockIcon } from "@lucide/vue";
import { computed, onBeforeUnmount, ref } from "vue";
import { t, tg } from "@/domain/i18n";
import type { Id, Who } from "@/domain/types";
import InviteCard from "@/features/settings/InviteCard.vue";
import { AnimatedList, EmptyState, Expand, SegmentedPills } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useWishes } from "./useWishes";
import { useWishUiStore } from "./wishUi";
import WishCard from "./WishCard.vue";
import WishForm from "./WishForm.vue";

const session = useSessionStore();
const wishUi = useWishUiStore();
const wishes = useWishes();

const options = computed(() => [
  { value: "me" as const, label: t("wishlist.page.mine") },
  { value: "partner" as const, label: t("wishlist.page.partner", { name: session.partnerName }) },
]);
const who = computed({
  get: () => wishUi.who,
  set: (v: Who | "") => v && wishUi.showList(v),
});
const mine = computed(() => wishUi.who === "me");
const list = computed(() =>
  session.app.wishes
    .filter((w) => w.owner === wishUi.who)
    .sort((a, b) => Number(a.done) - Number(b.done)),
);
const delArm = ref<Id | null>(null);
const empty = computed(() =>
  mine.value
    ? t("wishlist.page.emptyMine")
    : tg("wishlist.page.emptyPartner", session.app.partner?.gender, {
        name: session.partnerName,
      }),
);

function remove(id: Id) {
  if (wishes.remove(id)) delArm.value = null;
}

onBeforeUnmount(() => wishUi.closeForm());
</script>

<template>
  <SegmentedPills
    v-if="!session.solo"
    v-model="who"
    :options
    track
    light
    :label="t('wishlist.page.whose')"
  />
  <template v-if="!mine && !session.app.partner">
    <InviteCard />
    <EmptyState>
      {{ t("wishlist.page.noPartner", { other: session.other.nom }) }}
    </EmptyState>
  </template>
  <template v-else>
    <p
      v-if="!session.solo"
      class="bg-muted text-muted-foreground flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-semibold"
    >
      <LockIcon class="size-[15px] flex-none" :stroke-width="2.2" aria-hidden="true" />
      {{
        mine
          ? t("wishlist.page.secretMine")
          : t("wishlist.page.secretPartner", { name: session.partnerName })
      }}
    </p>
    <Expand>
      <WishForm v-if="wishUi.formOpen" />
      <Button v-else variant="secondary" block @click="wishUi.showForm()">
        {{ t("wishlist.page.add") }}
      </Button>
    </Expand>
    <AnimatedList v-if="list.length" as="div" grid class="grid grid-cols-2 gap-3">
      <WishCard
        v-for="w in list"
        :key="w.id"
        :wish="w"
        :mine
        :armed="delArm === w.id"
        @arm="delArm = w.id"
        @remove="remove(w.id)"
      />
    </AnimatedList>
    <EmptyState v-else>{{ empty }}</EmptyState>
  </template>
</template>
