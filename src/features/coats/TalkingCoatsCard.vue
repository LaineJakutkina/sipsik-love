<script setup lang="ts">
import { computed } from "vue";
import { TALK_EVERY } from "@/domain/catPhrases";
import { COAT_IDS, COAT_META, type TalkKind } from "@/domain/coats";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useCoatActions } from "./coatActions";
import TalkingCoatRow from "./TalkingCoatRow.vue";

/** Shop section with the talking cats: they pop up phrases while you tap them */
const session = useSessionStore();
const { chooseCoat } = useCoatActions();

const owned = computed(() => session.app.couple.owned ?? []);
const current = computed(() => session.app.couple.coat || "black");
const rows = computed(() =>
  COAT_IDS.flatMap((id) => {
    const kind: TalkKind | undefined = COAT_META[id].talks;
    if (!kind) return [];
    const offer = session.app.coats?.find((c) => c.id === id);
    return [{ id, name: COAT_META[id].name, kind, offer }];
  }),
);
</script>

<template>
  <Card tone="soft">
    <CardTitle>Говорящие котики</CardTitle>
    <p class="text-foreground/65 mt-1 text-[13px]">
      На первом тапе и потом на каждом {{ TALK_EVERY }}-м котик что-нибудь скажет
    </p>
    <ul class="mt-3 flex flex-col gap-2">
      <TalkingCoatRow
        v-for="r in rows"
        :key="r.id"
        v-bind="r"
        :on="current === r.id"
        :owned="owned.includes(r.id) || (!!r.offer && !r.offer.price)"
        @choose="chooseCoat(r.id)"
      />
    </ul>
  </Card>
</template>
