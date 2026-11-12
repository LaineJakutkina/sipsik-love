<script setup lang="ts">
import { LockIcon } from "@lucide/vue";
import { computed, onBeforeUnmount, ref } from "vue";
import type { Id, Who } from "@/domain/types";
import InviteCard from "@/features/settings/InviteCard.vue";
import { EmptyState, SegmentedPills } from "@/shared/components";
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
  { value: "me" as const, label: "Хочу я" },
  { value: "partner" as const, label: `Хочет ${session.partnerName}` },
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

function remove(id: Id) {
  if (wishes.remove(id)) delArm.value = null;
}

onBeforeUnmount(() => wishUi.closeForm());
</script>

<template>
  <SegmentedPills v-if="!session.solo" v-model="who" :options center label="Чей список" />
  <template v-if="!mine && !session.app.partner">
    <InviteCard />
    <EmptyState>
      Когда {{ session.other.nom }} присоединится, здесь появятся его желания.
    </EmptyState>
  </template>
  <template v-else>
    <p
      v-if="!session.solo"
      class="bg-muted text-muted-foreground flex items-center gap-2 rounded-full px-3.5 py-[9px] text-xs font-semibold"
    >
      <LockIcon class="size-[15px] flex-none" :stroke-width="2.2" aria-hidden="true" />
      {{
        mine
          ? "Кто готовит тебе подарок, ты не увидишь"
          : `Отметь, что даришь ты. ${session.partnerName} этого не увидит`
      }}
    </p>
    <WishForm v-if="wishUi.formOpen" />
    <Button v-else variant="secondary" block @click="wishUi.showForm()">+ Добавить желание</Button>
    <div v-if="list.length" class="grid grid-cols-2 gap-3">
      <WishCard
        v-for="w in list"
        :key="w.id"
        :wish="w"
        :mine
        :armed="delArm === w.id"
        @arm="delArm = w.id"
        @remove="remove(w.id)"
      />
    </div>
    <EmptyState v-else>
      {{ mine ? "Список пока пуст" : `${session.partnerName} пока ничего не загадал(а)` }}. Добавь
      первое желание.
    </EmptyState>
  </template>
</template>
