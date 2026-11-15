<script setup lang="ts">
import { t } from "@/domain/i18n";
import { SheetTitle } from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";

/** Stands in for a sheet whose code is still loading: a title line and a few rows */
</script>

<template>
  <div class="flex flex-col gap-3" aria-busy="true">
    <SheetTitle class="sr-only">{{ t("app.sheetLoading") }}</SheetTitle>
    <Skeleton class="h-7 w-2/3" />
    <Skeleton class="h-4 w-full" />
    <Skeleton class="h-11 w-full rounded-full" />
    <Skeleton class="h-11 w-full rounded-full" />
  </div>
</template>
