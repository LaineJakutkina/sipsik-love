import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { t } from "@/domain/i18n";
import { storage } from "@/services/storage";
import { telegram } from "@/services/telegram";
import { applyLocale } from "@/shared/locale";
import { isLocaleId, languageName, LOCALES, resolveLocale } from "@/shared/locale/locales";

/** Follow the Telegram language instead of a fixed one */
export const AUTO_LANGUAGE = "auto";

const STORAGE_KEY = "sipsik.language";
const CLOUD_KEY = "language";

const isChoice = (v: string | null): v is string => !!v && (v === AUTO_LANGUAGE || isLocaleId(v));

/**
 * The interface language. The choice is kept on the device (localStorage, instant at
 * start) and in Telegram CloudStorage (survives a cleared WebView and other devices).
 */
export const useLocaleStore = defineStore("locale", () => {
  const stored = storage.get(STORAGE_KEY);
  const choice = ref(isChoice(stored) ? stored : AUTO_LANGUAGE);
  let chosenHere = false;

  const systemLocale = computed(() =>
    resolveLocale(telegram.languageCode ?? navigator.language ?? ""),
  );
  /** Locale actually shown */
  const active = computed(() =>
    choice.value === AUTO_LANGUAGE ? systemLocale.value : choice.value,
  );

  const options = computed(() => [
    {
      value: AUTO_LANGUAGE,
      label: t("settings.language.auto", { name: languageName(systemLocale.value) }),
    },
    ...LOCALES.map((l) => ({ value: l.id, label: languageName(l.id) })),
  ]);

  function remember(next: string) {
    choice.value = next;
    storage.set(STORAGE_KEY, next);
  }

  async function choose(next: string) {
    if (!isChoice(next) || next === choice.value) return;
    chosenHere = true;
    remember(next);
    telegram.cloudSet(CLOUD_KEY, next);
    await applyLocale(active.value);
  }

  /** Show the stored language at once, then take the one saved in Telegram if it differs */
  async function boot() {
    await applyLocale(active.value);
    void telegram.cloudGet(CLOUD_KEY).then(async (saved) => {
      if (chosenHere || !isChoice(saved) || saved === choice.value) return;
      remember(saved);
      await applyLocale(active.value);
    });
  }

  return { choice, active, options, choose, boot };
});
