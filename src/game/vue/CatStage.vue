<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from "vue";
import type { CharacterLook } from "../character/compose";
import { GameStage } from "../engine/GameStage";
import { HomeScene } from "../scenes/HomeScene";

/**
 * Live WebGL stage with the cat. Keep one per screen: each instance owns a WebGL
 * context. Interactive stages render as a button so taps work with keyboard and
 * screen readers too.
 */
const props = defineProps<{
  look: CharacterLook;
  /** Speech bubble text over the cat */
  say?: string | null;
  /** Accessible label; makes the stage a tappable button */
  label?: string;
}>();
const emit = defineEmits<{ pet: [] }>();

const host = useTemplateRef<HTMLElement>("host");
const scene = shallowRef<HomeScene | null>(null);
const stage = new GameStage();

onMounted(async () => {
  if (!host.value || !(await stage.mount(host.value))) return;
  const home = await stage.scenes.show(new HomeScene(props.look));
  home.say(props.say ?? null);
  scene.value = home;
});
onBeforeUnmount(() => stage.destroy());

watch(
  () => props.look,
  (look) => scene.value?.setLook(look),
  { deep: true },
);
watch(
  () => props.say,
  (say) => scene.value?.say(say ?? null),
);

defineExpose({
  boop: () => scene.value?.boop(),
  shakeBubble: () => scene.value?.shakeBubble(),
});
</script>

<template>
  <button
    v-if="label"
    ref="host"
    type="button"
    class="cat-stage cursor-pointer"
    :aria-label="label"
    @click="emit('pet')"
  />
  <div v-else ref="host" class="cat-stage" />
</template>
