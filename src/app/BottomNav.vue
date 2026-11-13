<script setup lang="ts">
import { CalendarIcon, CatIcon, Gamepad2Icon, HouseIcon, StoreIcon } from "@lucide/vue";
import type { Component } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { usePlansStore } from "@/stores/plans";
import type { TabId } from "./router";

const NAV: { id: TabId; label: string; icon: Component }[] = [
  { id: "us", label: "Мы", icon: CatIcon },
  { id: "plans", label: "Планы", icon: CalendarIcon },
  { id: "home", label: "Дом", icon: HouseIcon },
  { id: "games", label: "Игры", icon: Gamepad2Icon },
  { id: "shop", label: "Магазин", icon: StoreIcon },
];

const route = useRoute();
const plans = usePlansStore();

/** «Планы» reopens the section you were in last */
const target = (id: TabId) => ({ name: id === "plans" ? plans.last : id });
</script>

<template>
  <div
    class="nav-fade from-background via-background/85 pointer-events-none fixed inset-x-0 bottom-0 z-10 bg-linear-to-t to-transparent"
    aria-hidden="true"
  />
  <nav
    aria-label="Разделы"
    class="bottom-nav bg-primary/92 ring-primary-foreground/10 shadow-navy/30 fixed inset-x-3 z-20 mx-auto max-w-[496px] rounded-[28px] p-1.5 shadow-xl ring-1 backdrop-blur-md"
  >
    <div class="grid grid-cols-5">
      <RouterLink
        v-for="n in NAV"
        :key="n.id"
        v-slot="{ href, navigate }"
        :to="target(n.id)"
        replace
        custom
      >
        <a
          :href
          :aria-current="route.meta.tab === n.id ? 'page' : undefined"
          class="group text-primary-foreground aria-[current=page]:opacity-100 flex min-w-0 flex-col items-center gap-0.5 py-0.5 text-[10.5px] font-bold no-underline opacity-60"
          @click="navigate"
        >
          <span
            class="group-aria-[current=page]:bg-secondary group-aria-[current=page]:text-secondary-foreground grid h-8 w-[40px] place-items-center rounded-full"
          >
            <component :is="n.icon" class="size-[22px]" :stroke-width="2.2" aria-hidden="true" />
          </span>
          <span class="max-w-full truncate">{{ n.label }}</span>
        </a>
      </RouterLink>
    </div>
  </nav>
</template>
