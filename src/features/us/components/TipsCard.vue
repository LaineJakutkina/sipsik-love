<script setup lang="ts">
import { ref } from "vue";
import { t } from "@/domain/i18n";
import { storage } from "@/services/storage";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

const TIPS_KEY = "sipsik-tips-v1";

/** First-run explanation; hidden for good after «Понятно» */
const session = useSessionStore();
const seen = ref(!!storage.get(TIPS_KEY));

function dismiss() {
  storage.set(TIPS_KEY, "1");
  seen.value = true;
}
</script>

<template>
  <Card v-if="!seen" tone="soft">
    <CardTitle>{{ t("us.tips.title") }}</CardTitle>
    <ol class="mt-2.5 mb-3 flex list-decimal flex-col gap-1.5 pl-5 text-sm">
      <template v-if="session.solo">
        <li>
          <b>{{ t("us.tips.solo.tap.title") }}</b> {{ t("us.tips.solo.tap.text") }}
        </li>
        <li>
          <b>{{ t("us.tips.solo.wishlist.title") }}</b> {{ t("us.tips.solo.wishlist.text") }}
        </li>
        <li>
          <b>{{ t("us.tips.solo.note.title") }}</b> {{ t("us.tips.solo.note.text") }}
        </li>
        <li>
          <b>{{ t("us.tips.solo.hardDay.title") }}</b>
          {{ t("us.tips.solo.hardDay.text", { name: session.petName }) }}
        </li>
      </template>
      <template v-else>
        <li>
          <b>{{ t("us.tips.couple.tap.title") }}</b> {{ t("us.tips.couple.tap.text") }}
        </li>
        <li>
          <b>{{ t("us.tips.couple.wishlist.title") }}</b>
          {{ t("us.tips.couple.wishlist.text", { other: session.other.gen }) }}
        </li>
        <li>
          <b>{{ t("us.tips.couple.note.title") }}</b>
          {{ t("us.tips.couple.note.text", { other: session.other.dat }) }}
        </li>
        <li>
          {{ t("us.tips.couple.settings.before", { other: session.other.gen }) }}
          <b>{{ t("us.tips.couple.settings.link") }}</b>
          {{ t("us.tips.couple.settings.after") }}
        </li>
      </template>
    </ol>
    <Button @click="dismiss">{{ t("us.tips.gotIt") }}</Button>
  </Card>
</template>
