<script setup lang="ts">
import { CalendarIcon, CatIcon, GiftIcon, HouseIcon, MapPinIcon, StoreIcon } from "@lucide/vue";
import type { Component } from "vue";
import type { TabId } from "./router";

const NAV: { id: TabId; label: string; icon: Component }[] = [
  { id: "us", label: "Мы", icon: CatIcon },
  { id: "wish", label: "Вишлист", icon: GiftIcon },
  { id: "home", label: "Дом", icon: HouseIcon },
  { id: "cal", label: "Календарь", icon: CalendarIcon },
  { id: "go", label: "Куда идём", icon: MapPinIcon },
  { id: "shop", label: "Магазин", icon: StoreIcon },
];
</script>

<template>
  <nav
    aria-label="Разделы"
    class="bottom-nav bg-primary fixed inset-x-3 z-20 mx-auto max-w-[496px] rounded-[28px] p-1.5"
  >
    <div class="grid grid-cols-6">
      <RouterLink
        v-for="n in NAV"
        :key="n.id"
        :to="{ name: n.id }"
        replace
        class="group text-primary-foreground aria-[current=page]:opacity-100 flex min-w-0 flex-col items-center gap-0.5 py-1 text-[10.5px] font-bold no-underline opacity-72"
      >
        <span
          class="group-aria-[current=page]:bg-secondary group-aria-[current=page]:text-secondary-foreground grid h-[34px] w-[40px] place-items-center rounded-full"
        >
          <component :is="n.icon" class="size-[22px]" :stroke-width="2.2" aria-hidden="true" />
        </span>
        <span class="max-w-full truncate">{{ n.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>
