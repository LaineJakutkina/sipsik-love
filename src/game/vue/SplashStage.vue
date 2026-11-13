<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from "vue";
import type { CharacterLook } from "../character/compose";
import { GameStage } from "../engine/GameStage";
import { SplashScene } from "../scenes/SplashScene";

/** WebGL stage for the intro: the truck ride plays once, then `done` */
const props = defineProps<{ look: CharacterLook }>();
const emit = defineEmits<{ done: [] }>();

const host = useTemplateRef<HTMLElement>("host");
const stage = new GameStage();

onMounted(async () => {
  if (!host.value || !(await stage.mount(host.value))) return;
  await stage.scenes.show(new SplashScene(props.look, () => emit("done")));
});
onBeforeUnmount(() => stage.destroy());
</script>

<template>
  <span ref="host" class="block size-full" />
</template>
