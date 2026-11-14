<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@/shared/ui/button";

/** Phone viewports in CSS pixels */
const DEVICES = [
  { id: "13pm", name: "iPhone 13 Pro Max", width: 428, height: 926 },
  { id: "13", name: "iPhone 13", width: 390, height: 844 },
  { id: "se", name: "iPhone SE", width: 375, height: 667 },
  { id: "android", name: "Android", width: 360, height: 800 },
] as const;

const deviceId = ref<(typeof DEVICES)[number]["id"]>("13pm");
const device = computed(() => DEVICES.find((d) => d.id === deviceId.value) ?? DEVICES[0]);
/** The app inside opens on the tab from this page's hash, the wishlist by default */
const src = `playground.html?app${location.hash || "#/wish"}`;
const frame = ref<HTMLIFrameElement | null>(null);

function reload() {
  frame.value?.contentWindow?.location.reload();
}
</script>

<template>
  <div class="bg-muted flex min-h-dvh flex-col items-center gap-4 p-6">
    <div class="flex flex-wrap items-center justify-center gap-2">
      <Button
        v-for="d in DEVICES"
        :key="d.id"
        size="sm"
        :variant="d.id === deviceId ? 'default' : 'outline'"
        @click="deviceId = d.id"
      >
        {{ d.name }}
      </Button>
      <Button size="sm" variant="ghost" @click="reload">↻ Перезапустить</Button>
    </div>
    <p class="text-muted-foreground text-xs font-semibold">
      {{ device.width }}×{{ device.height }} · mock Telegram + API в памяти
    </p>
    <div class="border-primary bg-primary overflow-hidden rounded-[52px] border-[12px] shadow-2xl">
      <iframe
        ref="frame"
        data-testid="device"
        :src
        :width="device.width"
        :height="device.height"
        :title="device.name"
        class="bg-background block rounded-[40px]"
      />
    </div>
  </div>
</template>
