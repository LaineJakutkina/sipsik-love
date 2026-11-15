<script setup lang="ts">
import { computed } from "vue";
import { COAT_META, isCoatId } from "@/domain/coats";
import { t } from "@/domain/i18n";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { useSessionStore } from "@/stores/session";

/** Shop header: who we are dressing and what it wears now */
const session = useSessionStore();
const coat = computed(() => session.app.couple.coat || "black");
const coatName = computed(() => (isCoatId(coat.value) ? COAT_META[coat.value].name : ""));
</script>

<template>
  <h1 class="sr-only">{{ t("coats.band.shop") }}</h1>
  <div class="bg-navy-2 flex items-center gap-3 rounded-[22px] p-3">
    <CharacterThumb
      kind="face"
      :mood="session.catMood"
      :coat="coat"
      :width="64"
      class="bg-paper size-16 flex-none p-1"
    />
    <div class="min-w-0">
      <b class="block truncate text-[17px] leading-tight font-extrabold">{{ session.petName }}</b>
      <span v-if="coatName" class="text-secondary block text-[13px] font-bold">
        {{ t("coats.band.current", { name: coatName }) }}
      </span>
      <span class="block text-xs font-semibold opacity-75">
        {{ session.solo ? t("coats.band.foreverSolo") : t("coats.band.foreverShared") }}
      </span>
    </div>
  </div>
</template>
