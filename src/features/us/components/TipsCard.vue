<script setup lang="ts">
import { ref } from "vue";
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
    <CardTitle>Как тут всё устроено</CardTitle>
    <ol class="mt-2.5 mb-3 flex list-decimal flex-col gap-1.5 pl-5 text-sm">
      <template v-if="session.solo">
        <li><b>Тапай котика</b>: за тапы он получает вещи. Задания дня дают бонус.</li>
        <li><b>Вишлист</b> с фото: пригодится, когда спросят, что тебе подарить.</li>
        <li><b>Записка себе в будущее</b> придёт тебе в случайный момент недели.</li>
        <li>
          <b>Тяжёлый день?</b> Отметь настроение, и {{ session.petName }} предложит подышать
          вместе.
        </li>
      </template>
      <template v-else>
        <li><b>Тапайте котика</b> вдвоём. Тапы общие, за них котик получает вещи.</li>
        <li>
          <b>Вишлист:</b> кнопка «Я подарю» на желании {{ session.other.gen }}. Он не узнает, кто
          дарит.
        </li>
        <li><b>Записка</b> придёт {{ session.other.dat }} в случайный момент недели.</li>
        <li>
          Пригласить {{ session.other.gen }} и выключить уведомления можно в <b>настройках</b>
          вверху справа.
        </li>
      </template>
    </ol>
    <Button @click="dismiss">Понятно</Button>
  </Card>
</template>
