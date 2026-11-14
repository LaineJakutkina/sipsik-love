<script setup lang="ts">
import { CalendarIcon, CatIcon, Gamepad2Icon, HouseIcon, StoreIcon } from "@lucide/vue";
import { computed, type Component } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { cn } from "@/shared/lib/utils";
import { usePlansStore } from "@/stores/plans";
import type { TabId } from "./router";

const NAV: { id: TabId; label: string; icon: Component }[] = [
  { id: "us", label: "Мы", icon: CatIcon },
  { id: "plans", label: "Планы", icon: CalendarIcon },
  { id: "home", label: "Дом", icon: HouseIcon },
  { id: "games", label: "Игры", icon: Gamepad2Icon },
  { id: "shop", label: "Магазин", icon: StoreIcon },
];

/**
 * The peach pill is a layer of dark icons clipped to a 40px window centred on the
 * active column (a column is 20%). Only the window moves, so an icon is dark exactly
 * where the pill covers it — no colour change racing the slide.
 */
const PILL_AT: Record<TabId, string> = {
  us: "[clip-path:inset(0_calc(90%_-_20px)_0_calc(10%_-_20px)_round_9999px)]",
  plans: "[clip-path:inset(0_calc(70%_-_20px)_0_calc(30%_-_20px)_round_9999px)]",
  home: "[clip-path:inset(0_calc(50%_-_20px)_0_calc(50%_-_20px)_round_9999px)]",
  games: "[clip-path:inset(0_calc(30%_-_20px)_0_calc(70%_-_20px)_round_9999px)]",
  shop: "[clip-path:inset(0_calc(10%_-_20px)_0_calc(90%_-_20px)_round_9999px)]",
};

const route = useRoute();
const plans = usePlansStore();
const active = computed(() => route.meta.tab);

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
    <div class="relative grid grid-cols-5">
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
          :aria-current="active === n.id ? 'page' : undefined"
          class="group text-primary-foreground flex min-w-0 flex-col items-center gap-0.5 py-0.5 text-[10.5px] font-bold no-underline"
          @click="navigate"
        >
          <span
            class="ease-spring grid h-8 w-[40px] place-items-center opacity-60 transition duration-300 group-active:scale-85 group-aria-[current=page]:opacity-100"
          >
            <component :is="n.icon" class="size-[22px]" :stroke-width="2.2" aria-hidden="true" />
          </span>
          <span
            class="max-w-full truncate opacity-60 transition-opacity duration-300 group-aria-[current=page]:opacity-100"
          >
            {{ n.label }}
          </span>
        </a>
      </RouterLink>
      <div
        :class="
          cn(
            'bg-secondary text-secondary-foreground ease-out-soft pointer-events-none absolute inset-x-0 top-0.5 grid h-8 transform-gpu grid-cols-5 transition-[clip-path,opacity] duration-400',
            active ? PILL_AT[active] : `${PILL_AT.us} opacity-0`,
          )
        "
        aria-hidden="true"
      >
        <span v-for="n in NAV" :key="n.id" class="grid place-items-center">
          <component :is="n.icon" class="size-[22px]" :stroke-width="2.2" />
        </span>
      </div>
    </div>
  </nav>
</template>
