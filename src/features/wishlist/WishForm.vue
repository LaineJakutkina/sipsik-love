<script setup lang="ts">
import { computed, nextTick, reactive, useTemplateRef, watch } from "vue";
import { t } from "@/domain/i18n";
import type { Photo } from "@/domain/types";
import { PhotoPicker } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSessionStore } from "@/stores/session";
import { useWishes, type WishDraft } from "./useWishes";
import { useWishUiStore } from "./wishUi";

/** “Новое желание” form for the list shown now; photo is kept in the ui store */
const session = useSessionStore();
const wishUi = useWishUiStore();
const wishes = useWishes();

const draft = reactive<WishDraft>({ title: "", price: "", link: "", note: "" });
const mine = computed(() => wishUi.who === "me");
const used = computed(() => wishes.photoCount(wishUi.who));
const limit = wishes.photoLimit;
const photo = computed(() => wishUi.draftPhoto);

function pick(p: Photo) {
  wishUi.draftPhoto = p;
}

const titleInput = useTemplateRef<{ $el: HTMLInputElement }>("title");
watch(
  () => wishUi.focusTitle,
  async (focus) => {
    if (!focus) return;
    await nextTick();
    titleInput.value?.$el.focus();
    wishUi.focusTitle = false;
  },
  { immediate: true },
);

async function submit() {
  if (await wishes.add(draft)) Object.assign(draft, { title: "", price: "", link: "", note: "" });
}
</script>

<template>
  <Card as="form" class="gap-2" novalidate @submit.prevent="submit">
    <CardTitle>
      {{
        mine
          ? t("wishlist.form.titleMine")
          : t("wishlist.form.titlePartner", { name: session.partnerName })
      }}
    </CardTitle>
    <p v-if="used >= limit" class="text-muted-foreground text-[13px]">
      {{ t("wishlist.form.photosFull", { limit }) }}
    </p>
    <PhotoPicker
      v-else
      :title="photo ? t('wishlist.form.photoAdded') : t('wishlist.form.addPhoto')"
      :subtitle="
        photo ? t('wishlist.form.replaceHint') : t('wishlist.form.photoHint', { used, limit })
      "
      :preview="photo?.thumb"
      @pick="pick"
    />
    <Input
      ref="title"
      v-model="draft.title"
      :placeholder="t('wishlist.form.what')"
      maxlength="120"
    />
    <div class="grid grid-cols-2 gap-2">
      <Input v-model="draft.price" :placeholder="t('wishlist.form.price')" maxlength="40" />
      <Input
        v-model="draft.link"
        type="url"
        :placeholder="t('wishlist.form.link')"
        maxlength="500"
      />
    </div>
    <Input v-model="draft.note" :placeholder="t('wishlist.form.note')" maxlength="300" />
    <div class="grid grid-cols-2 gap-2">
      <Button variant="outline" @click="wishUi.closeForm()">
        {{ t("common.actions.cancel") }}
      </Button>
      <Button type="submit">{{ t("common.actions.add") }}</Button>
    </div>
  </Card>
</template>
